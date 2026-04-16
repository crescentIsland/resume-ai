import Link from 'next/link'
import Navbar from '@/components/Navbar'

const features = [
  {
    href: '/create',
    icon: '✦',
    title: 'AI 创建简历',
    desc: '没有简历？填写你的经历，AI 帮你生成一份专业的求职简历。',
    color: '#91c53a',
    bg: '#f3faeb',
  },
  {
    href: '/optimize',
    icon: '◈',
    title: 'AI 优化简历',
    desc: '已有简历？上传后 AI 诊断问题、改写关键段落，让简历更有竞争力。',
    color: '#5e55a2',
    bg: '#f0effe',
  },
  {
    href: '/plan',
    icon: '◎',
    title: '求职规划',
    desc: '输入目标 JD，AI 分析技能差距，生成从现在到拿 offer 的行动计划。',
    color: '#6d9a2a',
    bg: '#f3faeb',
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 overflow-hidden">

        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-64px)] flex items-center"
          style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #edfae0 100%)' }}>

          {/* Background decorative blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #5e55a2 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #91c53a 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

          {/* Kickresume-style large arc on right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[130%] rounded-l-full pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #5e55a220 0%, #91c53a15 100%)', border: '1px solid #5e55a215' }} />

          <div className="relative max-w-6xl mx-auto px-6 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="flex flex-col gap-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
                style={{ backgroundColor: '#5e55a215', color: '#5e55a2', border: '1px solid #5e55a230' }}>
                ✦ AI 驱动的求职助手
              </div>

              <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.15]" style={{ color: '#1a1a2e' }}>
                用 AI 打造<br />
                <span style={{
                  background: 'linear-gradient(90deg, #91c53a, #5e55a2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>超级简历</span><br />
                离理想岗位更近一步
              </h1>

              <p className="text-lg leading-relaxed max-w-md" style={{ color: '#5a5a7a' }}>
                不只是改简历——从生成简历、优化内容，到分析技能差距、制定求职计划，陪你走完求职准备的每一步。
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/create"
                  className="px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }}>
                  立即开始 →
                </Link>
                <Link href="/optimize"
                  className="px-7 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'white', color: '#5e55a2', border: '2px solid #5e55a230', boxShadow: '0 2px 12px #5e55a215' }}>
                  优化我的简历
                </Link>
              </div>

              <p className="text-sm" style={{ color: '#9999b3' }}>无需注册 · 免费使用 · 1 分钟出结果</p>
            </div>

            {/* Right: Demo Card */}
            <div className="relative flex items-center justify-center z-10">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
                style={{ background: 'linear-gradient(135deg, #91c53a, #5e55a2)' }} />

              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
                style={{ border: '1px solid #e8e0ff' }}>

                {/* Top bar */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1a1a2e' }}>简历分析报告</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9999b3' }}>AI 完成分析 · 刚刚</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: '#f3faeb', color: '#6d9a2a' }}>
                    分析完成
                  </span>
                </div>

                {/* Score bar */}
                <div className="rounded-2xl p-4 mb-4 flex items-center gap-4"
                  style={{ background: 'linear-gradient(135deg, #f3faeb, #f0effe)' }}>
                  <div className="text-5xl font-black" style={{ color: '#91c53a' }}>72</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1.5" style={{ color: '#1a1a2e' }}>综合评分</p>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e8e0ff' }}>
                      <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg, #91c53a, #5e55a2)' }} />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-3">
                  <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#9999b3' }}>优势亮点</p>
                  {['有真实项目经历，可信度高', '技能描述清晰完整'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm py-1">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                        style={{ backgroundColor: '#91c53a' }}>✓</span>
                      <span style={{ color: '#4a4a6a' }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Improvements */}
                <div>
                  <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#9999b3' }}>改进建议</p>
                  {[
                    { p: '工作经历缺少量化数据', fix: '改为「推动 DAU 提升 23%」的结构' },
                    { p: '个人简介过于笼统', fix: '结合目标岗位写明核心优势' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl p-3 mb-2" style={{ backgroundColor: '#f0effe' }}>
                      <p className="text-xs font-semibold" style={{ color: '#5e55a2' }}>{item.p}</p>
                      <p className="text-xs mt-1" style={{ color: '#8078c4' }}>→ {item.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-24" style={{ backgroundColor: '#fff' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3" style={{ color: '#1a1a2e' }}>三步走完求职准备</h2>
              <p style={{ color: '#9999b3' }}>选择你现在的状态，AI 带你走完剩下的路</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <Link key={f.href} href={f.href}
                  className="rounded-2xl p-7 flex flex-col gap-4 transition-all hover:shadow-xl hover:-translate-y-1"
                  style={{ backgroundColor: f.bg, border: `1px solid ${f.color}20` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: f.color + '20', color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: '#1a1a2e' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b6b8a' }}>{f.desc}</p>
                  <span className="text-sm font-semibold" style={{ color: f.color }}>开始使用 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 text-center"
          style={{ background: 'linear-gradient(135deg, #5e55a2, #91c53a)' }}>
          <h2 className="text-3xl font-bold text-white mb-4">准备好了吗？</h2>
          <p className="text-white/80 mb-8 text-lg">现在开始，1 分钟生成你的专属求职规划</p>
          <Link href="/create"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'white', color: '#5e55a2' }}>
            免费开始 →
          </Link>
        </section>

      </main>
    </>
  )
}
