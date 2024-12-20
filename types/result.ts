interface SubjectMainInfoExperienceExpCount {
  text: string
  count: number
}

interface SubjectMainInfoExperienceProgress {
  text: string
  lvl: number
  sub_text: string
  progress_line: number
}

interface SubjectMainInfoExperienceToDay {
  text: string
  points: string
}

interface SubjectMainInfoExperience {
  exp_count: SubjectMainInfoExperienceExpCount
  progress: SubjectMainInfoExperienceProgress
  to_day: SubjectMainInfoExperienceToDay
}

export interface SubjectMainInfoCompleted {
  title: string
  count: number
  count_total: number
}

export interface SubjectMainInfo {
  top: string
  experience: SubjectMainInfoExperience
  completed: SubjectMainInfoCompleted[]
}

export interface CoursesItem {
  correctness: number
  id: number
  is_favorite: boolean
  mastering: string
  name: string
  exp: number
  level: number
  nextLevel: number
}

export interface AwardCard {
  title: string
  description?: string
  date?: string
  rarity?: number
  progress?: number
  icon_default: string
  icon?: string
  lvl_user?: number,
  lvl_max_award?: number,
  more_tasks?: number
}

export interface CoursesAwards {
  title: string
  awards_list: AwardCard[]
}
