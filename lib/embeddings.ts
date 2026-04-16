import { openai } from './claude'

// ── 向量化 ──────────────────────────────────────────────────────
// 使用阿里 DashScope text-embedding-v3 模型将文本转为向量
export async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-v3',
    input: text,
  })
  return response.data[0].embedding
}

// 批量向量化（DashScope 每次最多 10 条，分批发送）
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const BATCH_SIZE = 10
  const results: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const response = await openai.embeddings.create({
      model: 'text-embedding-v3',
      input: batch,
    })
    results.push(...response.data.map(d => d.embedding))
  }

  return results
}

// ── 余弦相似度 ──────────────────────────────────────────────────
// 衡量两个向量的方向相似程度，值越接近 1 表示语义越相近
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ── Top-K 检索 ──────────────────────────────────────────────────
// 给定查询向量和候选向量列表，返回最相似的 K 个索引
export function topK(
  queryVec: number[],
  candidateVecs: number[][],
  k: number
): number[] {
  const scored = candidateVecs.map((vec, idx) => ({
    idx,
    score: cosineSimilarity(queryVec, vec),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, k).map(s => s.idx)
}
