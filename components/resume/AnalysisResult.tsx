'use client'

import { AnalysisResult as AnalysisResultType } from '@/types'

interface Props {
  result: AnalysisResultType
  onReset: () => void
}

export default function AnalysisResult({ result, onReset }: Props) {
  const scoreColor =
    result.score >= 80
      ? 'text-green-600'
      : result.score >= 60
      ? 'text-yellow-600'
      : 'text-red-500'

  return (
    <div className="flex flex-col gap-6">
      {/* Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">简历评分</h2>
          <p className="text-slate-500 text-sm mt-1">{result.scoreReason}</p>
        </div>
        <div className={`text-6xl font-bold ${scoreColor}`}>{result.score}</div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">优势亮点</h3>
          <ul className="flex flex-col gap-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <div>
                  <p className="text-slate-800 font-medium">{s.point}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">改进建议</h3>
          <ul className="flex flex-col gap-3">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-blue-500 mt-0.5 shrink-0">→</span>
                <div>
                  <p className="text-slate-800 font-medium">{s.problem}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.why}</p>
                  <p className="text-blue-600 text-xs mt-1 font-medium">改法：{s.howToFix}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rewritten Sections */}
      {Object.values(result.rewrittenSections).some(Boolean) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">AI 改写建议稿</h3>
          <div className="flex flex-col gap-4">
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

      {/* Courses */}
      {result.suggestedCourses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">推荐提升课程</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.suggestedCourses.map((course, i) => (
              <div
                key={i}
                className="border border-slate-100 rounded-xl p-4 flex flex-col gap-1 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800 text-sm">{course.title}</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {course.platform}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{course.reason}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-slate-400">{course.skillArea}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="text-slate-500 hover:text-slate-700 text-sm underline self-center"
      >
        重新分析
      </button>
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{title}</p>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}
