import { NextRequest, NextResponse } from 'next/server'
import { markdownToDocx } from '@/lib/generateDocx'

export async function POST(req: NextRequest) {
  try {
    const { content, name } = await req.json()

    if (!content) {
      return NextResponse.json({ error: '缺少内容' }, { status: 400 })
    }

    const buffer = await markdownToDocx(content)
    const filename = `${name || '简历'}_AI优化版.docx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: '生成 Word 文件失败' }, { status: 500 })
  }
}
