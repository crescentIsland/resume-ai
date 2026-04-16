'use client'

import { Experience } from '@/types'

interface Props {
  title: string
  items: Experience[]
  onChange: (items: Experience[]) => void
  orgLabel?: string
  rolePlaceholder?: string
}

function emptyItem(): Experience {
  return { id: Date.now().toString(), orgName: '', role: '', startDate: '', endDate: '', description: '' }
}

const inputCls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
const inputStyle = { borderColor: '#e8e0ff' }

export default function AddableSection({ title, items, onChange, orgLabel = '名称', rolePlaceholder = '如：产品经理' }: Props) {
  const update = (id: string, field: keyof Experience, value: string) => {
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
        <div key={item.id} className="rounded-2xl p-5 flex flex-col gap-3 relative"
          style={{ backgroundColor: '#faf8ff', border: '1px solid #e8e0ff' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9999b3' }}>
              {title} {items.length > 1 ? `#${idx + 1}` : ''}
            </span>
            {items.length > 1 && (
              <button onClick={() => remove(item.id)}
                className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: '#f87171' }}>
                删除
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>{orgLabel}</label>
              <input className={inputCls} style={inputStyle}
                placeholder={`请输入${orgLabel}`}
                value={item.orgName}
                onChange={e => update(item.id, 'orgName', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>岗位 / 角色名称</label>
              <input className={inputCls} style={inputStyle}
                placeholder={rolePlaceholder}
                value={item.role}
                onChange={e => update(item.id, 'role', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>开始时间</label>
              <input type="month" className={inputCls} style={inputStyle}
                value={item.startDate}
                onChange={e => update(item.id, 'startDate', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>结束时间</label>
              <input type="month" className={inputCls} style={inputStyle}
                placeholder="至今可不填"
                value={item.endDate}
                onChange={e => update(item.id, 'endDate', e.target.value)}
                onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: '#6b6b8a' }}>主要职责 / 成果</label>
            <textarea rows={3} className={inputCls + ' resize-none'} style={inputStyle}
              placeholder="描述你做了什么、取得了什么成果，尽量带上数字..."
              value={item.description}
              onChange={e => update(item.id, 'description', e.target.value)}
              onFocus={e => e.currentTarget.style.borderColor = '#5e55a2'}
              onBlur={e => e.currentTarget.style.borderColor = '#e8e0ff'}
            />
          </div>
        </div>
      ))}

      <button onClick={add}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-sm w-fit"
        style={{ backgroundColor: '#f0effe', color: '#5e55a2', border: '1.5px dashed #5e55a250' }}>
        <span className="text-base leading-none">+</span>
        添加{title}
      </button>
    </div>
  )
}
