'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import StepWizard from '@/components/create/StepWizard'
import EducationSection from '@/components/create/EducationSection'
import AddableSection from '@/components/create/AddableSection'
import ResumePreview from '@/components/create/ResumePreview'
import { CreateResumeForm, Education, Experience } from '@/types'

const STEPS = [
  { label: '基本信息' },
  { label: '教育背景' },
  { label: '工作 & 实习' },
  { label: '项目 & 校园' },
  { label: '荣誉技能' },
]

function newExp(): Experience {
  return { id: Date.now().toString(), orgName: '', role: '', startDate: '', endDate: '', description: '' }
}
function newEdu(): Education {
  return { id: Date.now().toString(), degree: '', school: '', major: '', startDate: '', endDate: '' }
}

const inputCls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
const inputStyle = { borderColor: '#e8e0ff' }

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const [form, setForm] = useState<CreateResumeForm>({
    name: '', gender: '', age: '', email: '', phone: '', photo: '',
    educations: [newEdu()],
    workExperiences: [newExp()],
    internshipExperiences: [newExp()],
    projectExperiences: [newExp()],
    campusExperiences: [newExp()],
    honors: '', certifications: '', skills: '',
  })

  const set = (field: keyof CreateResumeForm, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setResult(json.content)
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!result) return
    setDownloading(true)
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: result, name: form.name }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.name || '简历'}_AI生成版.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('下载失败，请稍后重试')
    } finally {
      setDownloading(false)
    }
  }

  // ── 结果页 ──
  if (result) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen" style={{ background: '#f0effe44' }}>
          {/* 顶部操作栏 */}
          <div className="sticky top-16 z-40 bg-white border-b px-6 py-3"
            style={{ borderColor: '#e8e0ff' }}>
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>简历预览</span>
                <span className="text-xs ml-2" style={{ color: '#9999b3' }}>以下为文档视图，下载后可在 Word 中编辑</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownload} disabled={downloading}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                  {downloading ? '生成中...' : '⬇ 下载 Word'}
                </button>
                <button onClick={handleCopy}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ backgroundColor: copied ? '#91c53a' : '#f0effe', color: copied ? 'white' : '#5e55a2' }}>
                  {copied ? '已复制 ✓' : '复制'}
                </button>
                <button onClick={() => setResult(null)}
                  className="px-4 py-1.5 rounded-lg text-sm"
                  style={{ color: '#9999b3' }}>
                  重新填写
                </button>
              </div>
            </div>
          </div>

          {/* 文档预览区 */}
          <div className="py-10 px-6">
            <ResumePreview content={result} />
          </div>
        </main>
      </>
    )
  }

  // ── 表单页 ──
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #edfae0 100%)', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>AI 创建简历</h1>
            <p className="text-sm mt-1" style={{ color: '#9999b3' }}>分步填写，AI 帮你生成专业简历</p>
          </div>

          <StepWizard steps={STEPS} current={step} />

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6" style={{ border: '1px solid #e8e0ff' }}>

            {/* Step 0: 基本信息 */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg mb-1" style={{ color: '#1a1a2e' }}>基本信息</h2>

                {/* 照片 */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#f0effe', border: '2px dashed #5e55a250' }}>
                    {form.photo
                      ? <img src={form.photo} alt="photo" className="w-full h-full object-cover" />
                      : <span className="text-2xl">📷</span>}
                  </div>
                  <div>
                    <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>
                      上传照片
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </label>
                    <p className="text-xs mt-1.5" style={{ color: '#9999b3' }}>建议白底证件照</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: '姓名', key: 'name', placeholder: '张三' },
                    { label: '年龄', key: 'age', placeholder: '22' },
                  ].map(f => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>{f.label}</label>
                      <input className={inputCls} style={inputStyle} placeholder={f.placeholder}
                        value={form[f.key as keyof CreateResumeForm] as string}
                        onChange={e => set(f.key as keyof CreateResumeForm, e.target.value)}
                        onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                        onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>性别</label>
                    <select className={inputCls} style={{ ...inputStyle, backgroundColor: 'white' }}
                      value={form.gender} onChange={e => set('gender', e.target.value)}
                      onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}>
                      <option value="">请选择</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: '邮箱', key: 'email', placeholder: 'example@email.com' },
                    { label: '电话', key: 'phone', placeholder: '138-0000-0000' },
                  ].map(f => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>{f.label}</label>
                      <input className={inputCls} style={inputStyle} placeholder={f.placeholder}
                        value={form[f.key as keyof CreateResumeForm] as string}
                        onChange={e => set(f.key as keyof CreateResumeForm, e.target.value)}
                        onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                        onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: 教育背景 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg mb-1" style={{ color: '#1a1a2e' }}>教育背景</h2>
                <p className="text-sm" style={{ color: '#9999b3' }}>从最高学历开始填写，可添加多条</p>
                <EducationSection items={form.educations}
                  onChange={items => set('educations', items)} />
              </div>
            )}

            {/* Step 2: 工作 & 实习 */}
            {step === 2 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>工作经历</h2>
                  <p className="text-sm -mt-2" style={{ color: '#9999b3' }}>没有可跳过</p>
                  <AddableSection title="工作经历" orgLabel="公司名称"
                    rolePlaceholder="如：产品经理"
                    items={form.workExperiences}
                    onChange={items => set('workExperiences', items)} />
                </div>
                <div className="h-px" style={{ backgroundColor: '#e8e0ff' }} />
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>实习经历</h2>
                  <AddableSection title="实习经历" orgLabel="公司名称"
                    rolePlaceholder="如：产品运营"
                    items={form.internshipExperiences}
                    onChange={items => set('internshipExperiences', items)} />
                </div>
              </div>
            )}

            {/* Step 3: 项目 & 校园 */}
            {step === 3 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>项目经历</h2>
                  <AddableSection title="项目经历" orgLabel="项目名称"
                    rolePlaceholder="如：负责人 / 开发者"
                    items={form.projectExperiences}
                    onChange={items => set('projectExperiences', items)} />
                </div>
                <div className="h-px" style={{ backgroundColor: '#e8e0ff' }} />
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>校园经历</h2>
                  <AddableSection title="校园经历" orgLabel="组织 / 社团名称"
                    rolePlaceholder="如：部长 / 成员"
                    items={form.campusExperiences}
                    onChange={items => set('campusExperiences', items)} />
                </div>
              </div>
            )}

            {/* Step 4: 荣誉技能 */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg mb-1" style={{ color: '#1a1a2e' }}>荣誉 · 证书 · 技能</h2>
                {[
                  { label: '所获荣誉', key: 'honors', placeholder: '如：国家奖学金、优秀毕业生、校级三好学生...' },
                  { label: '资格证书', key: 'certifications', placeholder: '如：CET-6（560分）、计算机二级、PMP...' },
                  { label: '专业技能', key: 'skills', placeholder: '如：Python / SQL / Axure / Figma / 英语（流利）...' },
                ].map(f => (
                  <div key={f.key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>{f.label}</label>
                    <textarea rows={3} className={inputCls + ' resize-none'} style={inputStyle}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof CreateResumeForm] as string}
                      onChange={e => set(f.key as keyof CreateResumeForm, e.target.value)}
                      onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                      onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: '#fff1f0', color: '#f87171', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>
              上一步
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                下一步 →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                {isLoading ? 'AI 生成中...' : '✦ 生成简历'}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
