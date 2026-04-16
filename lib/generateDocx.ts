import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  ShadingType,
} from 'docx'

// ── 字号常量（单位：half-points，1pt = 2）──
const SIZE_TITLE = 28      // 14pt
const SIZE_HEADING = 22    // 11pt
const SIZE_BODY = 18       // 9pt
const SIZE_SMALL = 16      // 8pt

export async function markdownToDocx(markdownText: string): Promise<Buffer> {
  const lines = markdownText.split('\n')
  const children: Paragraph[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd()

    // H1 — 姓名居中大标题
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: line.replace(/^# /, ''),
          bold: true,
          size: SIZE_TITLE,
          font: { name: 'Microsoft YaHei' },
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80, line: 240 },
      }))
      continue
    }

    // H2 — 分节标题（带底部紫色细线）
    if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: line.replace(/^## /, ''),
          bold: true,
          size: SIZE_HEADING,
          color: '5e55a2',
          font: { name: 'Microsoft YaHei' },
        })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '5e55a2' } },
        spacing: { before: 120, after: 60, line: 240 },
      }))
      continue
    }

    // H3 — 子标题（公司名/项目名）
    if (line.startsWith('### ')) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: line.replace(/^### /, ''),
          bold: true,
          size: SIZE_BODY,
          font: { name: 'Microsoft YaHei' },
        })],
        spacing: { before: 80, after: 40, line: 240 },
      }))
      continue
    }

    // 空行 — 极小间距
    if (line.trim() === '') {
      children.push(new Paragraph({
        text: '',
        spacing: { before: 0, after: 40, line: 240 },
      }))
      continue
    }

    // 列表项
    if (/^[-•]\s/.test(line)) {
      children.push(new Paragraph({
        children: parseInline(line.replace(/^[-•]\s/, ''), SIZE_BODY),
        bullet: { level: 0 },
        spacing: { before: 0, after: 30, line: 240 },
        indent: { left: convertInchesToTwip(0.2) },
      }))
      continue
    }

    // 普通段落
    children.push(new Paragraph({
      children: parseInline(line, SIZE_BODY),
      spacing: { before: 0, after: 40, line: 240 },
    }))
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { name: 'Microsoft YaHei' },
            size: SIZE_BODY,
          },
          paragraph: {
            spacing: { line: 240 },
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          // 紧凑页边距，确保内容在1页内
          margin: {
            top: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.7),
            right: convertInchesToTwip(0.7),
          },
        },
      },
      children,
    }],
  })

  return await Packer.toBuffer(doc)
}

function parseInline(text: string, size: number): TextRun[] {
  const runs: TextRun[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({
        text: text.slice(lastIndex, match.index),
        size,
        font: { name: 'Microsoft YaHei' },
      }))
    }
    runs.push(new TextRun({
      text: match[1],
      bold: true,
      size,
      font: { name: 'Microsoft YaHei' },
    }))
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({
      text: text.slice(lastIndex),
      size,
      font: { name: 'Microsoft YaHei' },
    }))
  }

  return runs.length > 0 ? runs : [new TextRun({ text, size, font: { name: 'Microsoft YaHei' } })]
}
