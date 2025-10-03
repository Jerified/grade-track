"use client"
import { useState, useMemo, useEffect } from "react"
import { Modal, Button, TextInput, Label } from "../ui"
import { Exam } from "@/lib/utils"
import confetti from "canvas-confetti"

type GradeModalProps = {
  exam: Exam
  open: boolean
  onClose: () => void
  onSubmit: (studentScore: number) => void
}

export default function GradeModal({ exam, open, onClose, onSubmit }: GradeModalProps) {
  const [studentScore, setStudentScore] = useState("")
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const triggerFireworks = () => {
    if (!isMounted) return
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const score = parseFloat(studentScore)

    if (isNaN(score)) {
      setError("Please enter a valid number")
      return
    }

    if (score < 0 || score > exam.maxPoints) {
      setError(`Score must be between 0 and ${exam.maxPoints}`)
      return
    }

    const percentage = (score / exam.maxPoints) * 100

    if (percentage >= exam.passingThreshold) {
      triggerFireworks()
    }

    onSubmit(score)
    setStudentScore("")
    setError("")

    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const gradeCalculations = useMemo(() => {
    const score = parseFloat(studentScore)
    if (isNaN(score)) {
      return { percentage: 0, status: "", isPassing: false }
    }

    const percentage = (score / exam.maxPoints) * 100
    const isPassing = percentage >= exam.passingThreshold

    return {
      percentage: percentage.toFixed(1),
      status: isPassing ? "Pass ✓" : "Fail ✗",
      isPassing
    }
  }, [studentScore, exam.maxPoints, exam.passingThreshold])

  return (
    <Modal open={open} onClose={onClose} title="Grade Exam">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3 bg-[#e8ddd0] dark:bg-[#252b4a] p-4 rounded-xl border border-black/10 dark:border-[#2a2f4a]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-black/60 dark:text-gray-400 mb-1">Exam</p>
              <p className="text-sm font-semibold text-black dark:text-gray-100">{exam.title}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black/60 dark:text-gray-400 mb-1">Max Points</p>
              <p className="text-sm font-semibold text-black dark:text-gray-100">{exam.maxPoints}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black/60 dark:text-gray-400 mb-1">Passing Threshold</p>
              <p className="text-sm font-semibold text-black dark:text-gray-100">{exam.passingThreshold}%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-black/60 dark:text-gray-400 mb-1">Weight</p>
              <p className="text-sm font-semibold text-black dark:text-gray-100">{exam.weight}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentScore" className="text-black dark:text-gray-100">Student Score</Label>
          <TextInput
            id="studentScore"
            type="number"
            step="0.01"
            placeholder={`Enter score (0 - ${exam.maxPoints})`}
            value={studentScore}
            onChange={(e) => {
              setStudentScore(e.target.value)
              setError("")
            }}
            className="dark:bg-[#252b4a] dark:border-[#2a2f4a] dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>

        {studentScore && !error && gradeCalculations.status && (
          <div className="space-y-2 bg-[#e8ddd0] dark:bg-[#252b4a] p-4 rounded-xl border-2 border-black/10 dark:border-[#2a2f4a]">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-black/70 dark:text-gray-300">Percentage:</span>
              <span className="font-bold text-xl text-black dark:text-gray-100">{gradeCalculations.percentage}%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-black/10 dark:border-[#3a3f5a] pt-2">
              <span className="text-sm font-medium text-black/70 dark:text-gray-300">Status:</span>
              <span className={`font-bold text-lg ${gradeCalculations.isPassing ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {gradeCalculations.status}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-[#252b4a] dark:text-gray-100 dark:hover:bg-[#2a2f4a]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#101622] text-white hover:bg-[#0b1120] dark:bg-[#2a2f4a] dark:hover:bg-[#353a5a]"
          >
            Submit Grade
          </Button>
        </div>
      </form>
    </Modal>
  )
}
