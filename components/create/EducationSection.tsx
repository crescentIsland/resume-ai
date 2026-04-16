'use client'

import { Education } from '@/types'

interface Props {
  items: Education[]
  onChange: (items: Education[]) => void
}

function emptyItem(): Education {
  return { id: Date.now().toString(), degree: '', school: '', major: '', startDate: '', endDate: '' }
}

const inputCls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
const inputStyle = { borderColor: '#e8e0ff' }

const degreeOptions = ['博士', '硕士', '本科', '大专', '其他']

export default function EducationSection({ items, onChange }: Props) {
  const update = (id: string, field: keyof Education, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const remove = (id: string) => {
    onChange(items.filter(item => item.id !== id))
  }

  const add = () => {
    onChange([...items, emptyItem()])
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-2xl p-5 flex flex-col gap-3"
          style={{ backgroundColor: '#faf8ff', border: '1px solid #e8e0ff' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9999b3' }}>
              学历 {items.length > 1 ? `#${idx + 1}` : ''}
            </span>
            {items.length > 1 && (
              <button onClick={() => remove(item.id)}
                className="text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                style={{ color: '#f87171' }}>
                删除
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>学历层次</label>
              <select className={inputCls} style={{ ...inputStyle, backgroundColor: 'white' }}
                value={item.degree}
                onChange={e => update(item.id, 'degree', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              >
                <option value="">请选择</option>
                {degreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>学校名称</label>
              <input className={inputCls} style={inputStyle}
                placeholder="如：北京大学"
                value={item.school}
                onChange={e => update(item.id, 'school', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>专业</label>
            <input className={inputCls} style={inputStyle}
              placeholder="如：计算机科学与技术"
              value={item.major}
              onChange={e => update(item.id, 'major', e.target.value)}
              onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
              onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>入学时间</label>
              <input type="month" className={inputCls} style={inputStyle}
                value={item.startDate}
                onChange={e => update(item.id, 'startDate', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>毕业时间</label>
              <input type="month" className={inputCls} style={inputStyle}
                value={item.endDate}
                onChange={e => update(item.id, 'endDate', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={add}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-sm w-fit"
        style={{ backgroundColor: '#f0effe', color: '#5e55a2', border: '1.5px dashed #5e55a250' }}>
        <span className="text-base leading-none">+</span>
        添加学历
      </button>
    </div>
  )
}
