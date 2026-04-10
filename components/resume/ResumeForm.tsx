'use client'

import { useState } from 'react'
import { ResumeData } from '@/types'

interface Props {
  onSubmit: (data: ResumeData) => void
  isLoading: boolean
}

export default function ResumeForm({ onSubmit, isLoading }: Props) {
  const [mode, setMode] = useState<'form' | 'paste'>('form')
  const [formData, setFormData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  })
  const [pasteText, setPasteText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'paste') {
      onSubmit({ ...formData, rawText: pasteText })
    } else {
      onSubmit(formData)
    }
  }

  const field = (
    label: string,
    key: keyof ResumeData,
    multiline = false,
    placeholder = ''
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={formData[key] as string}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      ) : (
        <input
          type="text"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={formData[key] as string}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('form')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'form'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          分项填写
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          直接粘贴
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'form' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {field('姓名', 'name', false, '张三')}
              {field('邮箱', 'email', false, 'zhangsan@example.com')}
              {field('电话', 'phone', false, '138-0000-0000')}
            </div>
            {field('个人简介', 'summary', true, '简要描述你的职业背景、核心技能和求职目标...')}
            {field('工作经历', 'experience', true, '公司名称、职位、时间段、主要职责和成就...')}
            {field('教育背景', 'education', true, '学校名称、专业、学历、毕业时间...')}
            {field('技能', 'skills', true, '编程语言、框架、工具、语言能力等...')}
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">粘贴完整简历内容</label>
            <textarea
              rows={14}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="将你的简历内容直接粘贴到这里..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg py-3 transition-colors"
        >
          {isLoading ? '分析中...' : '开始 AI 分析'}
        </button>
      </form>
    </div>
  )
}
