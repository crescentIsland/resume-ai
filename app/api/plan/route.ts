import { NextRequest, NextResponse } from 'next/server'
import { runReActAgent } from '@/lib/react-agent'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, weeksLeft } = await req.json()

    if (!resumeText || !jdText) {
      return NextResponse.json({ error: '请填写简历和目标 JD' }, { status: 400 })
    }

    // ReAct Agent：自主决定调用哪些工具（analyze_skill_gap / search_courses / get_interview_tips）
    // 每一步都记录到 trace，最终生成结构化规划
    const { plan, trace } = await runReActAgent(resumeText, jdText, weeksLeft)
    const planData = JSON.parse(plan)

    return NextResponse.json({ ...planData, _reactTrace: trace })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Plan error:', msg)
    return NextResponse.json({ error: `规划生成失败：${msg}` }, { status: 500 })
  }
}
