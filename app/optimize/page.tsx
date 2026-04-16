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
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResultType | null>(null)
  const [error, setError] = useState<string | null>(null)

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
              粘贴你的简历，AI 帮你评分、诊断问题、给出改写建议
            </p>
          </div>

          {/* 输入区 */}
          {!result && (
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4"
              style={{ border: '1px solid #e8e0ff' }}>
              <label className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                粘贴你的简历内容
              </label>
              <textarea
                rows={12}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                style={{ borderColor: '#e8e0ff' }}
                placeholder="将简历内容粘贴到这里，可以是纯文本格式..."
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: '#fff1f0', color: '#f87171', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                {isLoading ? 'AI 分析中...' : '◈ 开始分析'}
              </button>
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
