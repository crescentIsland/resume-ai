'use client'

interface Props {
  content: string
}

// 解析行内 **加粗**
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export default function ResumePreview({ content }: Props) {
  const lines = content.split('\n')

  return (
    // A4 比例白色卡片，模拟 Word 文档视觉
    <div className="bg-white shadow-xl mx-auto"
      style={{
        width: '100%',
        maxWidth: '680px',
        padding: '40px 52px',
        fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
        fontSize: '13px',
        lineHeight: '1.6',
        color: '#1a1a2e',
        border: '1px solid #e0ddf5',
        borderRadius: '4px',
      }}>
      {lines.map((raw, idx) => {
        const line = raw.trimEnd()

        // H1 — 居中大标题（姓名）
        if (line.startsWith('# ')) {
          return (
            <h1 key={idx} style={{
              fontSize: '20px', fontWeight: 700, textAlign: 'center',
              margin: '0 0 6px', color: '#1a1a2e', letterSpacing: '2px',
            }}>
              {line.replace(/^# /, '')}
            </h1>
          )
        }

        // H2 — 分节标题
        if (line.startsWith('## ')) {
          return (
            <div key={idx} style={{ margin: '14px 0 4px' }}>
              <h2 style={{
                fontSize: '13px', fontWeight: 700, color: '#5e55a2',
                margin: 0, paddingBottom: '3px',
                borderBottom: '1.5px solid #5e55a2',
              }}>
                {line.replace(/^## /, '')}
              </h2>
            </div>
          )
        }

        // H3 — 子标题
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} style={{
              fontSize: '13px', fontWeight: 700,
              margin: '8px 0 2px', color: '#1a1a2e',
            }}>
              {renderInline(line.replace(/^### /, ''))}
            </h3>
          )
        }

        // 空行
        if (line.trim() === '') {
          return <div key={idx} style={{ height: '4px' }} />
        }

        // 列表项
        if (/^[-•]\s/.test(line)) {
          return (
            <div key={idx} style={{
              display: 'flex', gap: '6px',
              margin: '1px 0', paddingLeft: '8px',
            }}>
              <span style={{ color: '#91c53a', flexShrink: 0, marginTop: '1px' }}>▸</span>
              <span>{renderInline(line.replace(/^[-•]\s/, ''))}</span>
            </div>
          )
        }

        // 普通段落
        return (
          <p key={idx} style={{ margin: '2px 0' }}>
            {renderInline(line)}
          </p>
        )
      })}
    </div>
  )
}
