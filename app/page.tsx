import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    href: '/create',
    icon: '✦',
    title: 'AI 创建简历',
    desc: '没有简历？填写你的经历，AI 帮你生成一份专业的求职简历。',
    color: '#91c53a',
  },
  {
    href: '/optimize',
    icon: '◈',
    title: 'AI 优化简历',
    desc: '已有简历？上传后 AI 诊断问题、改写关键段落，让简历更有竞争力。',
    color: '#5e55a2',
  },
  {
    href: '/plan',
    icon: '◎',
    title: '求职规划',
    desc: '输入目标岗位 JD，AI 分析你的技能差距，生成一份行动时间表。',
    color: '#6d9a2a',
  },
]

// 右侧演示卡片数据
const demoCard = {
  score: 72,
  strengths: ['有真实项目经历', '技能描述清晰'],
  improvements: [
    { problem: '工作经历缺少量化数据', howToFix: '改为「推动 DAU 提升 23%」的结构' },
    { problem: '个人简介过于笼统', howToFix: '结合目标岗位写明核心优势' },
  ],
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full py-16">

            {/* Left: Slogan */}
            <div className="flex flex-col justify-center gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
                style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>
                ✦ AI 驱动的求职助手
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#1a1a2e' }}>
                用 AI 打造
                <span style={{ color: '#91c53a' }}>超级简历</span>
                <br />
                离理想岗位
                <span style={{ color: '#5e55a2' }}>更近一步</span>
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: '#6b6b8a' }}>
                不只是改简历——从生成简历、优化内容，到分析技能差距、制定求职计划，陪你走完求职准备的每一步。
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  href="/create"
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}
                >
                  立即开始
                </Link>
                <Link
                  href="/optimize"
                  className="px-6 py-3 rounded-xl font-semibold border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#5e55a2', color: '#5e55a2' }}
                >
                  优化我的简历
                </Link>
              </div>
              <p className="text-sm" style={{ color: '#9999b3' }}>无需注册，免费使用</p>
            </div>

            {/* Right: Demo Card */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
                {/* Decorative gradient blob */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: '#91c53a' }} />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: '#5e55a2' }} />

                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>简历分析报告</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#f0effe', color: '#5e55a2' }}>
                    AI 生成
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4 p-4 rounded-xl mb-4"
                  style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="text-5xl font-bold" style={{ color: '#91c53a' }}>{demoCard.score}</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>综合评分</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9999b3' }}>有潜力，需针对性优化</p>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-2" style={{ color: '#9999b3' }}>优势亮点</p>
                  {demoCard.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm mb-1">
                      <span style={{ color: '#91c53a' }}>✓</span>
                      <span style={{ color: '#4a4a6a' }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Improvements */}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#9999b3' }}>改进建议</p>
                  {demoCard.improvements.map((item, i) => (
                    <div key={i} className="rounded-lg p-3 mb-2" style={{ backgroundColor: '#f0effe' }}>
                      <p className="text-xs font-medium" style={{ color: '#5e55a2' }}>{item.problem}</p>
                      <p className="text-xs mt-1" style={{ color: '#8078c4' }}>→ {item.howToFix}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" style={{ backgroundColor: '#f0effe22' }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-3" style={{ color: '#1a1a2e' }}>
              三步走完求职准备
            </h2>
            <p className="text-center mb-12" style={{ color: '#9999b3' }}>
              选择你现在的状态，AI 带你走完剩下的路
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: f.color + '20', color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold" style={{ color: '#1a1a2e' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>{f.desc}</p>
                  <span className="text-sm font-medium mt-auto" style={{ color: f.color }}>
                    开始 →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
