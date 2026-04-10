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
  strengths: string[]
  improvements: string[]
  rewrittenSections: {
    summary?: string
    experience?: string
    skills?: string
  }
  suggestedCourses: Course[]
}

export interface Course {
  title: string
  platform: string
  description: string
  url?: string
  skillArea: string
}
