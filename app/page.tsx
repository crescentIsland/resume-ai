'use client'

import { useState } from 'react'
import ResumeForm from '@/components/resume/ResumeForm'
import AnalysisResult from '@/components/resume/AnalysisResult'
import { ResumeData, AnalysisResult as AnalysisResultType } from '@/types'

export default function Home() {
  const [result, setResult] = useState<AnalysisResultType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ResumeData) => {
    setIsLoading(true)
    setError(null)

    const resumeText = data.rawText
      ? data.rawText
      : [
          data.name && `姓名：${data.name}`,
          data.email && `邮箱：${data.email}`,
          data.phone && `电话：${data.phone}`,
          data.summary && `个人简介：\n${data.summary}`,
          data.experience && `工作经历：\n${data.experience}`,
          data.education && `教育背景：\n${data.education}`,
          data.skills && `技能：\n${data.skills}`,
        ]
          .filter(Boolean)
          .join('\n\n')

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || '分析失败')
        return
      }
      setResult(json)
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">AI 简历优化助手</h1>
        <p className="text-slate-500 mt-2">输入你的简历，AI 帮你打分、改写、推荐提升课程</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {result ? (
        <AnalysisResult result={result} onReset={() => setResult(null)} />
      ) : (
        <ResumeForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </main>
  )
}
