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
