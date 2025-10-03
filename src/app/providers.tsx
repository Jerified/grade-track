"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Exam, ExamDraft, generateId, loadExamsFromStorage, saveExamsToStorage, formatDateToLong } from "@/lib/utils"

type Filters = {
  query: string
  subject: string | null
  dateRange: string | null
}

type ExamsContextValue = {
  exams: Exam[]
  filtered: Exam[]
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
  createExam: (draft: ExamDraft) => void
  updateExam: (id: string, draft: ExamDraft) => void
  deleteExam: (id: string) => void
}

const ExamsContext = createContext<ExamsContextValue | undefined>(undefined)

const MOCK: Exam[] = [
  {
    id: "1",
    title: "Mat 202 | Actuarial Vector Analysis",
    year: "YR 2",
    dateCreated: "November 21, 2025",
    dateDue: "November 25, 2025",
    weight: "35%",
    maxPoints: 100,
    passingThreshold: 50,
    status: "Not Attempted",
    course: "Mathematics",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "2",
    title: "Mat 202 | Actuarial Vector Analysis",
    year: "YR 2",
    dateCreated: "November 21, 2025",
    dateDue: "November 24, 2025",
    weight: "35%",
    maxPoints: 100,
    passingThreshold: 50,
    status: "Not Attempted",
    course: "Mathematics",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "3",
    title: "THE 301 | Contemporary Performance",
    year: "YR 3",
    dateCreated: "November 20, 2025",
    dateDue: "November 23, 2025",
    weight: "40%",
    maxPoints: 100,
    passingThreshold: 60,
    status: "Not Attempted",
    course: "Theatre Art",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "4",
    title: "Mat 301 | Advanced Calculus",
    year: "YR 3",
    dateCreated: "November 19, 2025",
    dateDue: "November 22, 2025",
    weight: "45%",
    maxPoints: 100,
    passingThreshold: 50,
    status: "Not Attempted",
    course: "Mathematics",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "5",
    title: "THE 201 | Stage Design & Production",
    year: "YR 2",
    dateCreated: "November 18, 2025",
    dateDue: "November 23, 2025",
    weight: "35%",
    maxPoints: 100,
    passingThreshold: 55,
    status: "Not Attempted",
    course: "Theatre Art",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "6",
    title: "Mat 101 | Linear Algebra",
    year: "YR 1",
    dateCreated: "November 17, 2025",
    dateDue: "November 21, 2025",
    weight: "30%",
    maxPoints: 100,
    passingThreshold: 50,
    status: "Not Attempted",
    course: "Mathematics",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "7",
    title: "THE 401 | Theatre History",
    year: "YR 4",
    dateCreated: "November 21, 2025",
    dateDue: "November 24, 2025",
    weight: "35%",
    maxPoints: 100,
    passingThreshold: 60,
    status: "Not Attempted",
    course: "Theatre Art",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "8",
    title: "Mat 202 | Differential Equations",
    year: "YR 2",
    dateCreated: "November 22, 2025",
    dateDue: "November 25, 2025",
    weight: "40%",
    maxPoints: 100,
    passingThreshold: 50,
    status: "Not Attempted",
    course: "Mathematics",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
  {
    id: "9",
    title: "THE 101 | Introduction to Drama",
    year: "YR 1",
    dateCreated: "November 23, 2025",
    dateDue: "November 24, 2025",
    weight: "30%",
    maxPoints: 100,
    passingThreshold: 55,
    status: "Not Attempted",
    course: "Theatre Art",
    description: "Lorem ipsum dolor sit amet consectetur...",
    visible: true,
  },
]

export function ExamsProvider({ children }: { children: React.ReactNode }) {
  const [exams, setExams] = useState<Exam[]>([])
  const [filters, setFiltersState] = useState<Filters>({ query: "", subject: null, dateRange: null })

  useEffect(() => {
    // Load from localStorage or use mock data if empty
    const stored = loadExamsFromStorage()
    setExams(stored.length > 0 ? stored : MOCK)
  }, [])

  useEffect(() => {
    saveExamsToStorage(exams)
  }, [exams])

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }))
  }, [])

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase()
    return exams.filter((e) => {
      const matchesQuery = !q || `${e.title} ${e.course} ${e.year}`.toLowerCase().includes(q)
      const matchesSubject = !filters.subject || e.course === filters.subject
      return matchesQuery && matchesSubject
    })
  }, [exams, filters])

  const createExam = useCallback((draft: ExamDraft) => {
    const now = new Date()
    const item: Exam = {
      id: generateId(),
      dateCreated: formatDateToLong(now),
      ...draft,
    } as Exam
    setExams((prev) => [item, ...prev])
  }, [])

  const updateExam = useCallback((id: string, draft: ExamDraft) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...draft } as Exam : e)))
  }, [])

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo(
    () => ({ exams, filtered, filters, setFilters, createExam, updateExam, deleteExam }),
    [exams, filtered, filters, setFilters, createExam, updateExam, deleteExam]
  )

  return <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>
}

export function useExams() {
  const ctx = useContext(ExamsContext)
  if (!ctx) throw new Error("useExams must be used within ExamsProvider")
  return ctx
}
