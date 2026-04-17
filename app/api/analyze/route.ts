import { NextRequest, NextResponse } from 'next/server'
import { analyzeResume } from '@/lib/claude'
import { AnalysisResult } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeText } = body

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: '请输入更完整的简历内容（至少50字）' },
        { status: 400 }
      )
    }

    const { result: rawResult, thinking } = await analyzeResume(resumeText)
    const result: AnalysisResult = JSON.parse(rawResult)

    return NextResponse.json({ ...result, _thinking: thinking })
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    )
  }
}
