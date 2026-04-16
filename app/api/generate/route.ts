import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/claude'
import { CreateResumeForm } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const form: CreateResumeForm = await req.json()

    // 将表单数据序列化为结构化文本，供 AI 理解
    const formText = buildFormText(form)

    const response = await openai.chat.completions.create({
      model: 'qwen-plus',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `你是一位拥有 10 年经验的资深 HR 顾问，擅长为准应届生撰写专业简历。
你的简历风格：
- 语言简洁、专业，避免空洞表述
- 工作/实习/项目经历优先使用「动词 + 量化成果」的结构，如「负责 XX，推动 YY 提升 ZZ%」
- 如果用户没有提供量化数据，用专业化的动词和具体描述来补强，但不要捏造数字
- 个人简介要结合目标方向（如果用户提供了）简明扼要地概括核心竞争力`,
        },
        {
          role: 'user',
          content: `请根据以下信息，为我生成一份完整的中文求职简历。

${formText}

输出要求：
- 使用 Markdown 格式，结构清晰
- 按照：个人信息 → 教育背景 → 工作经历 → 实习经历 → 项目经历 → 校园经历 → 所获荣誉 → 资格证书 → 专业技能 的顺序排列（没有内容的部分跳过）
- 每条经历用 STAR 原则（情境-任务-行动-结果）优化描述
- 整体控制在一页 A4 纸的信息量`,
        },
      ],
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty response')

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: '生成失败，请稍后重试' }, { status: 500 })
  }
}

function buildFormText(form: CreateResumeForm): string {
  const lines: string[] = []

  lines.push(`【基本信息】`)
  lines.push(`姓名：${form.name}，性别：${form.gender}，年龄：${form.age}`)
  lines.push(`联系方式：邮箱 ${form.email}，电话 ${form.phone}`)

  if (form.educations.length) {
    lines.push(`\n【教育背景】`)
    form.educations.forEach(e => {
      lines.push(`${e.degree} | ${e.school} | ${e.major} | ${e.startDate} ~ ${e.endDate || '至今'}`)
    })
  }

  const expBlock = (label: string, items: typeof form.workExperiences) => {
    if (!items.length || !items[0].orgName) return
    lines.push(`\n【${label}】`)
    items.forEach(e => {
      lines.push(`${e.orgName} | ${e.role} | ${e.startDate} ~ ${e.endDate || '至今'}`)
      if (e.description) lines.push(`  职责：${e.description}`)
    })
  }

  expBlock('工作经历', form.workExperiences)
  expBlock('实习经历', form.internshipExperiences)
  expBlock('项目经历', form.projectExperiences)
  expBlock('校园经历', form.campusExperiences)

  if (form.honors) lines.push(`\n【所获荣誉】\n${form.honors}`)
  if (form.certifications) lines.push(`\n【资格证书】\n${form.certifications}`)
  if (form.skills) lines.push(`\n【专业技能】\n${form.skills}`)

  return lines.join('\n')
}
