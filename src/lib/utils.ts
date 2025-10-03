import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Exam domain types
export type Exam = {
  id: string;
  title: string;
  year: string;
  dateCreated: string;
  dateDue: string;
  weight: string; // e.g. "35%"
  maxPoints: number;
  passingThreshold: number;
  status: string; // e.g. "Not Attempted"
  course: string;
  description: string;
  visible: boolean;
}

export type ExamDraft = Omit<Exam, "id" | "dateCreated"> & {
  id?: string;
  dateCreated?: string;
}

// Local storage helpers
const STORAGE_KEY = "grade-track:exams"

export function loadExamsFromStorage(): Exam[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Exam[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveExamsToStorage(exams: Exam[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(exams))
  } catch {
    // ignore
  }
}

export function generateId(prefix = "exam") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function formatDateToLong(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
}

export function downloadJson(filename: string, data: unknown) {
  if (typeof window === "undefined") return
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
