import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

export async function analyzeResume(resumeText: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'qwen-plus',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `你是一位专业的职业顾问和简历优化专家。请分析以下简历，并以 JSON 格式返回结果。

简历内容：
${resumeText}

请返回以下 JSON 格式（不要有其他内容，只返回 JSON）：
{
  "score": <简历评分 1-100>,
  "strengths": [<优点1>, <优点2>, ...],
  "improvements": [<改进建议1>, <改进建议2>, ...],
  "rewrittenSections": {
    "summary": "<改写后的个人简介>",
    "experience": "<改写后的工作经历（更专业的表述）>",
    "skills": "<改写后的技能部分>"
  },
  "suggestedCourses": [
    {
      "title": "<课程名称>",
      "platform": "<平台，如 Coursera/Udemy/网易云课堂等>",
      "description": "<课程简介>",
      "skillArea": "<针对的技能领域>"
    }
  ]
}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty response')
  return content
}
