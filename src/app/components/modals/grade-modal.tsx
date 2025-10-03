"use client"
import { useState } from "react"
import { Modal, Button, TextInput, Label } from "../ui"
import { Exam } from "@/lib/utils"

type GradeModalProps = {
  exam: Exam
  open: boolean
  onClose: () => void
  onSubmit: (studentScore: number) => void
}

export default function GradeModal({ exam, open, onClose, onSubmit }: GradeModalProps) {
  const [studentScore, setStudentScore] = useState("")
  const [error, setError] = useState("")

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

    onSubmit(score)
    setStudentScore("")
    setError("")
    onClose()
  }

  const calculatePercentage = () => {
    const score = parseFloat(studentScore)
    if (isNaN(score)) return 0
    return ((score / exam.maxPoints) * 100).toFixed(1)
  }

  const getGradeStatus = () => {
    const score = parseFloat(studentScore)
    if (isNaN(score)) return ""
    const percentage = (score / exam.maxPoints) * 100
    if (percentage >= exam.passingThreshold) {
      return "Pass ✓"
    }
    return "Fail ✗"
  }

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

        {studentScore && !error && (
          <div className="space-y-2 bg-[#e8ddd0] dark:bg-[#252b4a] p-4 rounded-xl border-2 border-black/10 dark:border-[#2a2f4a]">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-black/70 dark:text-gray-300">Percentage:</span>
              <span className="font-bold text-xl text-black dark:text-gray-100">{calculatePercentage()}%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-black/10 dark:border-[#3a3f5a] pt-2">
              <span className="text-sm font-medium text-black/70 dark:text-gray-300">Status:</span>
              <span className={`font-bold text-lg ${parseFloat(studentScore) / exam.maxPoints * 100 >= exam.passingThreshold ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {getGradeStatus()}
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
