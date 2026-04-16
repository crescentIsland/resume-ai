// ── 优化简历 ──────────────────────────────────────────────────
export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: string
  education: string
  skills: string
  rawText?: string
}

export interface AnalysisResult {
  score: number
  scoreReason: string
  strengths: { point: string; reason: string }[]
  improvements: { problem: string; why: string; howToFix: string }[]
  rewrittenSections: {
    summary: string | null
    experience: string | null
    skills: string | null
  }
  suggestedCourses: Course[]
}

export interface Course {
  title: string
  platform: string
  duration: string
  skillArea: string
  reason: string
}

// ── 创建简历 ──────────────────────────────────────────────────
export interface Education {
  id: string
  degree: string      // 学历层次：本科 / 硕士 / 博士 / 大专
  school: string
  major: string
  startDate: string
  endDate: string
}

export interface Experience {
  id: string
  orgName: string     // 公司 / 机构 / 项目 / 组织名称
  role: string        // 岗位名称
  startDate: string
  endDate: string
  description: string // 主要职责
}

export interface CreateResumeForm {
  // 基本信息
  name: string
  gender: string
  age: string
  email: string
  phone: string
  photo: string       // base64 或空字符串
  // 学历（可多条）
  educations: Education[]
  // 四类经历
  workExperiences: Experience[]
  internshipExperiences: Experience[]
  projectExperiences: Experience[]
  campusExperiences: Experience[]
  // 其他
  honors: string
  certifications: string
  skills: string
}

export interface GeneratedResume {
  content: string     // AI 生成的完整简历正文（Markdown 格式）
}
