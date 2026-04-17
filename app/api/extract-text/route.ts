import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    // ── Word (.docx) ──────────────────────────────────────────────
    if (ext === 'docx') {
      const mammoth = (await import('mammoth')).default
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    }

    // ── PDF ──────────────────────────────────────────────────────
    else if (ext === 'pdf') {
      // 直接引用 lib 路径，跳过 index.js 的测试文件加载逻辑
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default
      const result = await pdfParse(buffer)
      text = result.text
    }

    // ── 图片（JPG / PNG / WEBP）→ AI 视觉识别 ──────────────────────
    else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext ?? '')) {
      const base64 = buffer.toString('base64')
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

      const response = await openai.chat.completions.create({
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: 'text',
                text: '请完整识别并提取这张简历图片中的所有文字内容，保持原有的结构和排列，不要遗漏任何信息。',
              },
            ] as never,
          },
        ],
      })
      text = response.choices[0].message.content ?? ''
    }

    else {
      return NextResponse.json({ error: '不支持的文件格式，请上传 Word、PDF 或图片' }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json({ error: '文件内容为空，请检查文件是否有文字' }, { status: 400 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Extract text error:', msg)
    return NextResponse.json({ error: `文件解析失败：${msg}` }, { status: 500 })
  }
}
