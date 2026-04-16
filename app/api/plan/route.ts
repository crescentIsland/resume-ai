import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/claude'
import { retrieveRelevantCourses } from '@/lib/rag'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, weeksLeft } = await req.json()

    if (!resumeText || !jdText) {
      return NextResponse.json({ error: '请填写简历和目标 JD' }, { status: 400 })
    }

    // ── Step 1：提取技能缺口 ──────────────────────────────────────
    // 先让 AI 分析简历与 JD 的差距，输出技能缺口关键词
    const gapResponse = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的 HR 顾问，擅长分析求职者与岗位的匹配度。',
        },
        {
          role: 'user',
          content: `请对比以下简历和目标岗位 JD，列出候选人的技能缺口。
只输出缺口技能的关键词列表，用逗号分隔，不需要解释。

简历：
${resumeText}

目标 JD：
${jdText}`,
        },
      ],
    })

    const skillGapText = gapResponse.choices[0].message.content ?? ''

    // ── Step 2：RAG 检索相关课程 ──────────────────────────────────
    // 用技能缺口关键词在课程库中做语义检索，返回最相关的真实课程
    const relevantCourses = await retrieveRelevantCourses(skillGapText, 6)

    // ── Step 3：生成完整求职规划 ──────────────────────────────────
    // 将检索到的真实课程注入 prompt，让 AI 基于它们制定规划
    const courseList = relevantCourses
      .map((c, i) => `${i + 1}. 《${c.title}》- ${c.platform}（${c.duration}）\n   ${c.description}`)
      .join('\n')

    const planResponse = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: `你是一位资深职业规划顾问，专注于帮助准应届生顺利拿到心仪 offer。
你的建议风格：具体、可执行、有优先级，不说废话。`,
        },
        {
          role: 'user',
          content: `请根据以下信息，为求职者制定一份详细的求职规划。

【简历】
${resumeText}

【目标岗位 JD】
${jdText}

【距投递还有】${weeksLeft} 周

【识别出的技能缺口】
${skillGapText}

【可参考的真实课程库（请从中选择最合适的推荐给用户）】
${courseList}

请输出以下 JSON 格式：
{
  "matchScore": <简历与 JD 的匹配度，0-100>,
  "matchReason": "<一句话说明匹配度评分依据>",
  "skillGaps": [
    { "skill": "<缺口技能>", "importance": "高/中/低", "reason": "<为什么重要>" }
  ],
  "weeklyPlan": [
    { "week": "<第几周，如'第1-2周'>", "focus": "<本阶段重点>", "tasks": ["<任务1>", "<任务2>"] }
  ],
  "recommendedCourses": [
    { "title": "<课程名>", "platform": "<平台>", "duration": "<时长>", "reason": "<推荐理由，说明解决哪个技能缺口>" }
  ],
  "interviewTips": ["<面试建议1>", "<面试建议2>", "<面试建议3>"]
}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const planContent = planResponse.choices[0].message.content
    if (!planContent) throw new Error('Empty response')

    const plan = JSON.parse(planContent)

    // 把 RAG 检索的元数据也返回给前端，用于展示「课程来自知识库」
    return NextResponse.json({
      ...plan,
      _ragMeta: {
        skillGapText,
        retrievedCount: relevantCourses.length,
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Plan error:', msg)
    return NextResponse.json({ error: `规划生成失败：${msg}` }, { status: 500 })
  }
}
