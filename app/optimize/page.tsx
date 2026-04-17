'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { AnalysisResult as AnalysisResultType } from '@/types'

const importanceStyle = {
  high: { bg: '#fff1f0', color: '#f87171' },
  mid:  { bg: '#f0effe', color: '#5e55a2' },
}

export default function OptimizePage() {
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<(AnalysisResultType & { _thinking?: string }) | null>(null)
  const [thinkingOpen, setThinkingOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsExtracting(true)
    setError(null)
    setFileName(file.name)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/extract-text', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { setError(json.error); setFileName(null); return }
      setResumeText(json.text)
    } catch {
      setError('文件解析失败，请稍后重试')
      setFileName(null)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async () => {
    if (resumeText.trim().length < 50) {
      setError('请输入更完整的简历内容（至少50字）')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setResult(json)
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const scoreColor = result
    ? result.score >= 80 ? '#91c53a' : result.score >= 60 ? '#fbbf24' : '#f87171'
    : '#91c53a'

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen"
        style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #edfae0 100%)' }}>
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6">

          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>AI 优化简历</h1>
            <p className="text-sm mt-1" style={{ color: '#9999b3' }}>
              上传或粘贴简历，AI 帮你评分、诊断问题、给出改写建议
            </p>
          </div>

          {/* 输入区 */}
          {!result && (
            <div className="bg-white rounded-2xl flex flex-col"
              style={{ border: '1px solid #e8e0ff', overflow: 'hidden' }}>

              {/* 文件附件标签（上传后显示） */}
              {fileName && (
                <div className="flex items-center gap-2 px-4 pt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: '#f0effe', color: '#5e55a2', border: '1px solid #5e55a230' }}>
                    {isExtracting
                      ? <span className="animate-pulse">⏳ 解析中...</span>
                      : <><span>📄</span><span>{fileName}</span></>
                    }
                    <button onClick={() => { setFileName(null); setResumeText('') }}
                      className="ml-1 hover:opacity-60 transition-opacity text-base leading-none">×</button>
                  </div>
                </div>
              )}

              {/* 文本输入框 */}
              <textarea
                rows={10}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full px-4 pt-4 pb-2 text-sm resize-none focus:outline-none"
                placeholder="粘贴你的简历内容，或点击左下角 + 上传文件..."
              />

              {/* 底部工具栏 */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderTop: '1px solid #f0effe' }}>
                <div className="flex items-center gap-2">
                  {/* 上传按钮 */}
                  <label className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                    style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}
                    title="上传文件（Word / PDF / 图片）">
                    <span className="text-lg font-light leading-none">+</span>
                    <input type="file" className="hidden"
                      accept=".docx,.pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload} />
                  </label>
                  <span className="text-xs" style={{ color: '#c4bce8' }}>
                    Word · PDF · 图片
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isExtracting}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                  {isLoading ? '分析中...' : '开始分析 →'}
                </button>
              </div>

              {error && (
                <div className="mx-4 mb-3 px-4 py-2.5 rounded-xl text-sm"
                  style={{ backgroundColor: '#fff1f0', color: '#f87171', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* 结果区 */}
          {result && (
            <div className="flex flex-col gap-5">

              {/* 评分 */}
              <div className="bg-white rounded-2xl p-6 flex items-center gap-6"
                style={{ border: '1px solid #e8e0ff' }}>
                <div className="text-6xl font-black" style={{ color: scoreColor }}>{result.score}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold" style={{ color: '#1a1a2e' }}>简历综合评分</span>
                    <span className="text-xs" style={{ color: '#9999b3' }}>满分100</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#f0effe' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${result.score}%`, background: `linear-gradient(90deg, ${scoreColor}, #5e55a2)` }} />
                  </div>
                  <p className="text-sm" style={{ color: '#6b6b8a' }}>{result.scoreReason}</p>
                </div>
              </div>

              {/* AI 思考过程折叠块 */}
              {result._thinking && (
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e0ff' }}>
                  <button
                    onClick={() => setThinkingOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:opacity-80"
                    style={{ backgroundColor: '#faf8ff' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#5e55a2' }}>🧠</span>
                      <span className="text-sm font-semibold" style={{ color: '#5e55a2' }}>查看 AI 思考过程</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#f0effe', color: '#8078c4' }}>
                        Chain of Thought
                      </span>
                    </div>
                    <span className="text-xs transition-transform"
                      style={{ color: '#9999b3', transform: thinkingOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                      ▼
                    </span>
                  </button>
                  {thinkingOpen && (
                    <div className="px-5 py-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f0effe' }}>
                      <p className="text-xs mb-2 font-semibold uppercase tracking-wide" style={{ color: '#c4bce8' }}>
                        Step 1 — 自由分析（未格式化）
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4a4a6a' }}>
                        {result._thinking}
                      </p>
                      <p className="text-xs mt-3 pt-3" style={{ color: '#c4bce8', borderTop: '1px solid #f0effe' }}>
                        Step 2 — 基于以上分析，生成结构化 JSON 报告（即下方内容）
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 优势 & 改进 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8e0ff' }}>
                  <h3 className="font-semibold mb-3" style={{ color: '#1a1a2e' }}>优势亮点</h3>
                  <ul className="flex flex-col gap-3">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5"
                          style={{ backgroundColor: '#91c53a' }}>✓</span>
                        <div>
                          <p className="font-medium" style={{ color: '#1a1a2e' }}>{s.point}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#9999b3' }}>{s.reason}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8e0ff' }}>
                  <h3 className="font-semibold mb-3" style={{ color: '#1a1a2e' }}>改进建议</h3>
                  <ul className="flex flex-col gap-3">
                    {result.improvements.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-base shrink-0 mt-0.5" style={{ color: '#5e55a2' }}>→</span>
                        <div>
                          <p className="font-medium" style={{ color: '#1a1a2e' }}>{s.problem}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#9999b3' }}>{s.why}</p>
                          <p className="text-xs mt-1 font-medium" style={{ color: '#5e55a2' }}>改法：{s.howToFix}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 改写建议稿 */}
              {Object.values(result.rewrittenSections).some(Boolean) && (
                <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8e0ff' }}>
                  <h3 className="font-semibold mb-4" style={{ color: '#1a1a2e' }}>AI 改写建议稿</h3>
                  <div className="flex flex-col gap-3">
                    {result.rewrittenSections.summary && (
                      <Section title="个人简介" content={result.rewrittenSections.summary} />
                    )}
                    {result.rewrittenSections.experience && (
                      <Section title="工作经历" content={result.rewrittenSections.experience} />
                    )}
                    {result.rewrittenSections.skills && (
                      <Section title="技能" content={result.rewrittenSections.skills} />
                    )}
                  </div>
                </div>
              )}

              {/* 课程推荐 */}
              {result.suggestedCourses.length > 0 && (
                <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8e0ff' }}>
                  <h3 className="font-semibold mb-4" style={{ color: '#1a1a2e' }}>推荐提升课程</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.suggestedCourses.map((c, i) => (
                      <div key={i} className="rounded-xl p-4 flex flex-col gap-1.5"
                        style={{ backgroundColor: '#faf8ff', border: '1px solid #e8e0ff' }}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm" style={{ color: '#1a1a2e' }}>《{c.title}》</span>
                          <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>{c.platform}</span>
                        </div>
                        <p className="text-xs" style={{ color: '#91c53a' }}>{c.duration}</p>
                        <p className="text-xs" style={{ color: '#6b6b8a' }}>{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { setResult(null); setResumeText('') }}
                className="text-sm self-center underline"
                style={{ color: '#9999b3' }}>
                重新分析
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#faf8ff', border: '1px solid #e8e0ff' }}>
      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#9999b3' }}>{title}</p>
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1a1a2e' }}>{content}</p>
    </div>
  )
}
