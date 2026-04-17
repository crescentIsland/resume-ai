import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

// ── Prompt 设计说明 ────────────────────────────────────────────
// 采用三层设计：
// 1. 系统角色（system）：锚定 AI 的身份、立场和行为边界
// 2. 思维链（CoT）：拆分「分析」和「输出」两步，让 AI 先推理再结构化
// 3. 输出约束：明确 JSON schema + 信息不足时的降级策略
// ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `你是一位拥有 10 年经验的资深 HR 顾问，曾服务于腾讯、阿里、字节跳动等一线互联网公司。
你的工作是帮助准应届生优化简历，你的建议风格是：
- 直接、具体，不说废话
- 每条改进意见都附带「为什么」和「怎么改」
- 如果简历中某部分信息不足以评估，明确指出需要补充什么，而不是凭空编造
- 评分严格但公正，大多数应届生简历在 40-65 分区间`

export async function analyzeResume(resumeText: string): Promise<{ result: string; thinking: string }> {
  // Step 1：让 AI 先做思维链分析（不要求 JSON，让它自由思考）
  const thinkingResponse = await openai.chat.completions.create({
    model: 'qwen-plus',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `请先阅读以下简历，用几句话总结：
1. 这个人的核心背景是什么？
2. 简历最突出的 2-3 个亮点
3. 最需要改进的 2-3 个问题（要具体，说明是哪个部分、为什么有问题）

简历内容：
${resumeText}`,
      },
    ],
  })

  const thinking = thinkingResponse.choices[0].message.content ?? ''

  // Step 2：基于思维链结果，生成结构化 JSON 输出
  const response = await openai.chat.completions.create({
    model: 'qwen-plus',
    max_tokens: 4096,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `请阅读以下简历，并参考分析思路，以 JSON 格式输出完整评估报告。

简历内容：
${resumeText}

你的分析思路（参考但不限于此）：
${thinking}

输出规则：
- score：1-100 的整数，评分要严格，附上一句评分理由
- strengths：2-4 条，每条说明「是什么」和「为什么是亮点」
- improvements：2-4 条，每条包含「问题描述」「原因」「具体改法」三个要素
- rewrittenSections：只改写简历中实际存在的部分，若某部分信息不足则值为 null
- suggestedCourses：3-5 个，必须与简历的技能 gap 直接相关，注明平台和预计学习时长

严格按以下 JSON schema 输出，不要有其他内容：
{
  "score": <number>,
  "scoreReason": "<一句话说明评分依据>",
  "strengths": [
    { "point": "<亮点>", "reason": "<为什么是亮点>" }
  ],
  "improvements": [
    { "problem": "<问题>", "why": "<原因>", "howToFix": "<具体改法>" }
  ],
  "rewrittenSections": {
    "summary": "<改写后的个人简介，或 null>",
    "experience": "<改写后的工作经历，或 null>",
    "skills": "<改写后的技能描述，或 null>"
  },
  "suggestedCourses": [
    {
      "title": "<课程名>",
      "platform": "<平台>",
      "duration": "<预计时长，如'约 8 小时'>",
      "skillArea": "<针对的技能方向>",
      "reason": "<为什么推荐这门课>"
    }
  ]
}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty response')
  return { result: content, thinking }
}
