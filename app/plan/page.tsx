'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ReActStep } from '@/lib/react-agent'

interface SkillGap { skill: string; importance: '高' | '中' | '低'; reason: string }
interface WeekTask { week: string; focus: string; tasks: string[] }
interface CourseRec { title: string; platform: string; duration: string; reason: string }
interface PlanResult {
  matchScore: number
  matchReason: string
  skillGaps: SkillGap[]
  weeklyPlan: WeekTask[]
  recommendedCourses: CourseRec[]
  interviewTips: string[]
  _reactTrace: ReActStep[]
}

const importanceColor = { 高: '#f87171', 中: '#fbbf24', 低: '#91c53a' }
const importanceBg = { 高: '#fff1f0', 中: '#fffbeb', 低: '#f3faeb' }

export default function PlanPage() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input')
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [weeksLeft, setWeeksLeft] = useState('6')
  const [result, setResult] = useState<PlanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [traceOpen, setTraceOpen] = useState(false)

  const handleSubmit = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('请填写简历和目标 JD')
      return
    }
    setStep('loading')
    setError(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jdText, weeksLeft: parseInt(weeksLeft) }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); setStep('input'); return }
      setResult(json)
      setStep('result')
    } catch {
      setError('网络错误，请稍后重试')
      setStep('input')
    }
  }

  // ── 加载中 ──
  if (step === 'loading') {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #edfae0 100%)' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl animate-pulse"
              style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
              ◎
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>AI 正在分析中</h2>
            <p className="text-sm" style={{ color: '#9999b3' }}>ReAct Agent 正在自主调用工具分析，请稍候...</p>
            <div className="flex gap-1.5 justify-center mt-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: '#5e55a2', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  // ── 结果页 ──
  if (step === 'result' && result) {
    const scoreColor = result.matchScore >= 70 ? '#91c53a' : result.matchScore >= 50 ? '#fbbf24' : '#f87171'
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen" style={{ background: '#f5f0ff44' }}>
          <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

            {/* 顶部标题 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>你的求职规划</h1>
                <p className="text-sm mt-1" style={{ color: '#9999b3' }}>
                  由 ReAct Agent 自主分析生成 · 课程推荐来自 RAG 知识库
                </p>
              </div>
              <button onClick={() => setStep('input')} className="text-sm px-4 py-2 rounded-xl"
                style={{ color: '#9999b3', backgroundColor: 'white', border: '1px solid #e8e0ff' }}>
                重新规划
              </button>
            </div>

            {/* 匹配度 */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-6"
              style={{ border: '1px solid #e8e0ff' }}>
              <div className="text-6xl font-black" style={{ color: scoreColor }}>{result.matchScore}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>简历与 JD 匹配度</span>
                  <span className="text-xs" style={{ color: '#9999b3' }}>满分100</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#f0effe' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${result.matchScore}%`, background: `linear-gradient(90deg, ${scoreColor}, #5e55a2)` }} />
                </div>
                <p className="text-sm" style={{ color: '#6b6b8a' }}>{result.matchReason}</p>
              </div>
            </div>

            {/* ReAct 推理追踪折叠块 */}
            {result._reactTrace && result._reactTrace.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e0ff' }}>
                <button
                  onClick={() => setTraceOpen(o => !o)}
                  className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:opacity-80"
                  style={{ backgroundColor: '#faf8ff' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: '#5e55a2' }}>⚙️</span>
                    <span className="text-sm font-semibold" style={{ color: '#5e55a2' }}>查看 AI 推理过程</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#f0effe', color: '#8078c4' }}>
                      ReAct Agent
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#f3faeb', color: '#6d9a2a' }}>
                      {result._reactTrace.filter(s => s.type === 'action').length} 次工具调用
                    </span>
                  </div>
                  <span className="text-xs transition-transform"
                    style={{ color: '#9999b3', transform: traceOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                    ▼
                  </span>
                </button>
                {traceOpen && (
                  <div className="px-5 py-4 flex flex-col gap-3"
                    style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f0effe' }}>
                    {result._reactTrace.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          {step.type === 'thought' && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>思考</span>
                          )}
                          {step.type === 'action' && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: '#f3faeb', color: '#6d9a2a' }}>行动</span>
                          )}
                          {step.type === 'observation' && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>观察</span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap flex-1"
                          style={{ color: '#4a4a6a' }}>
                          {step.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 技能缺口 */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e8e0ff' }}>
              <h2 className="font-bold mb-4" style={{ color: '#1a1a2e' }}>技能缺口分析</h2>
              <div className="flex flex-col gap-2">
                {result.skillGaps.map((g, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3"
                    style={{ backgroundColor: importanceBg[g.importance] }}>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0"
                      style={{ backgroundColor: importanceColor[g.importance] + '20', color: importanceColor[g.importance] }}>
                      {g.importance}
                    </span>
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{g.skill}</span>
                      <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>{g.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 时间表 */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e8e0ff' }}>
              <h2 className="font-bold mb-4" style={{ color: '#1a1a2e' }}>
                {weeksLeft} 周行动时间表
              </h2>
              <div className="flex flex-col gap-3">
                {result.weeklyPlan.map((w, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                        {i + 1}
                      </div>
                      {i < result.weeklyPlan.length - 1 && (
                        <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: '#e8e0ff', minHeight: '20px' }} />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: '#9999b3' }}>{w.week}</span>
                        <span className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>{w.focus}</span>
                      </div>
                      <ul className="flex flex-col gap-1">
                        {w.tasks.map((t, j) => (
                          <li key={j} className="flex gap-2 text-sm" style={{ color: '#6b6b8a' }}>
                            <span style={{ color: '#91c53a' }}>▸</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 课程推荐（RAG） */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e8e0ff' }}>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold" style={{ color: '#1a1a2e' }}>推荐课程</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: '#f3faeb', color: '#6d9a2a' }}>
                  ✦ RAG 知识库检索
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: '#9999b3' }}>
                以下课程从真实课程库中检索，根据你的技能缺口语义匹配
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.recommendedCourses.map((c, i) => (
                  <div key={i} className="rounded-xl p-4 flex flex-col gap-1.5"
                    style={{ backgroundColor: '#faf8ff', border: '1px solid #e8e0ff' }}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>《{c.title}》</span>
                      <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>{c.platform}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#91c53a' }}>{c.duration}</p>
                    <p className="text-xs" style={{ color: '#6b6b8a' }}>{c.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 面试建议 */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e8e0ff' }}>
              <h2 className="font-bold mb-4" style={{ color: '#1a1a2e' }}>面试准备建议</h2>
              <ul className="flex flex-col gap-2">
                {result.interviewTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5"
                      style={{ backgroundColor: '#5e55a2' }}>{i + 1}</span>
                    <span style={{ color: '#4a4a6a' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </main>
      </>
    )
  }

  // ── 输入页 ──
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen"
        style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #edfae0 100%)' }}>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>求职规划</h1>
            <p className="text-sm mt-1" style={{ color: '#9999b3' }}>
              输入简历和目标 JD，AI 帮你分析差距、制定行动计划
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 flex flex-col gap-5" style={{ border: '1px solid #e8e0ff' }}>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                你的简历
              </label>
              <textarea rows={7} value={resumeText} onChange={e => setResumeText(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                style={{ borderColor: '#e8e0ff' }}
                placeholder="将你的简历内容粘贴到这里..."
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                目标岗位 JD
              </label>
              <textarea rows={7} value={jdText} onChange={e => setJdText(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
                style={{ borderColor: '#e8e0ff' }}
                placeholder="将招聘 JD 粘贴到这里..."
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                距投递还有几周？
              </label>
              <div className="flex gap-2">
                {['2', '4', '6', '8', '12'].map(w => (
                  <button key={w} onClick={() => setWeeksLeft(w)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      backgroundColor: weeksLeft === w ? '#5e55a2' : '#f0effe',
                      color: weeksLeft === w ? 'white' : '#5e55a2',
                    }}>
                    {w} 周
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: '#fff1f0', color: '#f87171', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
              ◎ 生成我的求职规划
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
