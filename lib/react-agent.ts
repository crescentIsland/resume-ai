import { openai } from './claude'
import { retrieveRelevantCourses } from './rag'

// ── ReAct 工具定义 ─────────────────────────────────────────────
// ReAct = Reasoning + Acting
// AI 在每一步先「思考」需要做什么，再「行动」调用工具，观察结果后继续思考
// 直到信息足够，输出最终规划

const TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'analyze_skill_gap',
      description: '深入分析求职者在特定维度上与目标岗位的差距',
      parameters: {
        type: 'object',
        properties: {
          dimension: {
            type: 'string',
            description: '分析维度，如「技术技能」「软技能」「行业知识」「项目经验」',
          },
        },
        required: ['dimension'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_courses',
      description: '在课程知识库中搜索与技能缺口相关的学习资源（RAG 检索）',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索关键词，如「SQL 数据分析」「产品思维 用户研究」',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_interview_tips',
      description: '获取目标岗位的面试常见考点和准备策略',
      parameters: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            description: '目标岗位名称，如「产品经理」「数据分析师」「运营专员」',
          },
        },
        required: ['role'],
      },
    },
  },
]

// ── 工具执行函数 ───────────────────────────────────────────────
async function executeTool(
  name: string,
  args: Record<string, string>,
  context: { resume: string; jd: string }
): Promise<string> {
  if (name === 'analyze_skill_gap') {
    const res = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `请从「${args.dimension}」维度，分析以下简历与JD的具体差距，列出3-5个具体缺口，每条一句话。

简历：${context.resume.slice(0, 800)}
JD：${context.jd.slice(0, 800)}`,
        },
      ],
    })
    return res.choices[0].message.content ?? ''
  }

  if (name === 'search_courses') {
    const courses = await retrieveRelevantCourses(args.query, 4)
    return courses
      .map(c => `《${c.title}》- ${c.platform}（${c.duration}）：${c.description}`)
      .join('\n')
  }

  if (name === 'get_interview_tips') {
    const res = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `请给出「${args.role}」岗位校招面试的3-5个核心考点和准备建议，每条具体可执行。`,
        },
      ],
    })
    return res.choices[0].message.content ?? ''
  }

  return '工具不存在'
}

// ── ReAct 追踪记录 ─────────────────────────────────────────────
export interface ReActStep {
  type: 'thought' | 'action' | 'observation'
  content: string
  toolName?: string
  toolArgs?: Record<string, string>
}

export interface ReActResult {
  plan: string        // 最终规划的 JSON 字符串
  trace: ReActStep[]  // 完整推理追踪
}

// ── ReAct 主循环 ───────────────────────────────────────────────
export async function runReActAgent(
  resume: string,
  jd: string,
  weeksLeft: number
): Promise<ReActResult> {
  const trace: ReActStep[] = []
  const MAX_STEPS = 6

  const messages: Parameters<typeof openai.chat.completions.create>[0]['messages'] = [
    {
      role: 'system',
      content: `你是一位专业的求职规划顾问。你有以下工具可以使用：
- analyze_skill_gap：分析特定维度的技能差距
- search_courses：在课程库中搜索学习资源
- get_interview_tips：获取目标岗位面试考点

请通过多次调用工具，充分了解求职者的情况后，再生成最终规划。
建议流程：先分析技术技能差距 → 再分析软技能差距 → 搜索相关课程 → 获取面试建议 → 输出规划。`,
    },
    {
      role: 'user',
      content: `请帮我制定求职规划。

简历：
${resume}

目标 JD：
${jd}

距投递还有 ${weeksLeft} 周。

请先调用工具收集信息，最后以 JSON 格式输出规划。`,
    },
  ]

  // ReAct 循环
  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 1024,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
    })

    const msg = response.choices[0].message
    messages.push(msg as never)

    // 有工具调用 → 执行工具
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      for (const call of msg.tool_calls) {
        const args = JSON.parse(call.function.arguments) as Record<string, string>

        // 记录 Action
        trace.push({
          type: 'action',
          content: `调用工具 ${call.function.name}（参数：${JSON.stringify(args)}）`,
          toolName: call.function.name,
          toolArgs: args,
        })

        // 执行工具
        const observation = await executeTool(call.function.name, args, { resume, jd })

        // 记录 Observation
        trace.push({
          type: 'observation',
          content: observation,
          toolName: call.function.name,
        })

        // 把工具结果加入对话
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: observation,
        } as never)
      }
      continue
    }

    // 没有工具调用 → AI 输出最终答案
    const finalContent = msg.content ?? ''

    // 提取 JSON
    const jsonMatch = finalContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      trace.push({ type: 'thought', content: '信息收集完毕，生成最终规划' })
      return { plan: jsonMatch[0], trace }
    }

    // 如果没有 JSON，让 AI 重新输出结构化结果
    trace.push({ type: 'thought', content: finalContent })
  }

  // 超过最大步数，强制生成
  const finalResponse = await openai.chat.completions.create({
    model: 'qwen-plus',
    max_tokens: 2048,
    messages: [
      ...messages,
      {
        role: 'user',
        content: `请基于以上收集到的所有信息，以 JSON 格式输出求职规划：
{
  "matchScore": <0-100>,
  "matchReason": "<评分依据>",
  "skillGaps": [{ "skill": "", "importance": "高/中/低", "reason": "" }],
  "weeklyPlan": [{ "week": "", "focus": "", "tasks": [] }],
  "recommendedCourses": [{ "title": "", "platform": "", "duration": "", "reason": "" }],
  "interviewTips": []
}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  return {
    plan: finalResponse.choices[0].message.content ?? '{}',
    trace,
  }
}
