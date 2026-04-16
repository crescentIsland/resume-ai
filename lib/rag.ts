import { embed, embedBatch, topK } from './embeddings'
import coursesData from '@/data/courses.json'

export interface Course {
  id: string
  title: string
  platform: string
  duration: string
  skillTags: string[]
  description: string
}

const courses: Course[] = coursesData

// 课程向量缓存（进程生命周期内有效，避免每次请求都重新计算）
let courseVecsCache: number[][] | null = null

async function getCourseVecs(): Promise<number[][]> {
  if (courseVecsCache) return courseVecsCache

  // 将每门课的关键信息拼成一段文本再向量化，语义更丰富
  const texts = courses.map(c =>
    `${c.title} ${c.skillTags.join(' ')} ${c.description}`
  )

  courseVecsCache = await embedBatch(texts)
  return courseVecsCache
}

// ── RAG 主入口 ──────────────────────────────────────────────────
// 输入：技能缺口描述文本
// 输出：最相关的 K 门真实课程
export async function retrieveRelevantCourses(
  skillGapText: string,
  k = 6
): Promise<Course[]> {
  const [queryVec, courseVecs] = await Promise.all([
    embed(skillGapText),
    getCourseVecs(),
  ])

  const indices = topK(queryVec, courseVecs, k)
  return indices.map(i => courses[i])
}
