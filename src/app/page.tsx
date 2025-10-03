"use client"
import { useMemo, useState, useCallback, memo, useEffect } from "react"
import { useExams } from "./providers"
import { Card, GradeButton, BottomActionBar, Modal } from "./components/ui"
import ExamForm from "./components/forms/exam-form"
import GradeModal from "./components/modals/grade-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, SearchIcon, CalendarIcon, Calculator01Icon } from "@hugeicons/core-free-icons"
import { IoMdArrowDropdown } from "react-icons/io"
import { FiEdit } from "react-icons/fi"
import { downloadJson, Exam, ExamDraft } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

// Memoized modal wrapper to prevent parent re-renders
const ExamFormModal = memo(({
  open,
  editing,
  onClose,
  onSubmit
}: {
  open: boolean
  editing: Exam | undefined
  onClose: () => void
  onSubmit: (data: ExamDraft) => void
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Create/Edit Exam"
  >
    <ExamForm
      initial={editing}
      onCancel={onClose}
      onSubmit={onSubmit}
    />
  </Modal>
))
ExamFormModal.displayName = "ExamFormModal"

// Memoized grading modal wrapper
const GradingModal = memo(({
  exam,
  onClose,
  onSubmit
}: {
  exam: Exam | null
  onClose: () => void
  onSubmit: (studentScore: number) => void
}) => {
  if (!exam) return null
  return (
    <GradeModal
      exam={exam}
      open={true}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
})
GradingModal.displayName = "GradingModal"

export default function Home() {
  const { filtered, exams, deleteExam, createExam, updateExam, filters, setFilters } = useExams()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [gradingExamId, setGradingExamId] = useState<string | null>(null)

  const editing = useMemo(() => exams.find((e) => e.id === editingId), [editingId, exams])
  const gradingExam = useMemo(() => exams.find((e) => e.id === gradingExamId) ?? null, [gradingExamId, exams])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingId(null)
  }, [])

  const handleCloseGrading = useCallback(() => {
    setGradingExamId(null)
  }, [])

  const handleFormSubmit = useCallback((data: ExamDraft) => {
    if (editing) {
      updateExam(editing.id, data)
    } else {
      createExam(data)
    }
    setModalOpen(false)
    setEditingId(null)
  }, [editing, updateExam, createExam])

  const handleGradeSubmit = useCallback((examId: string) => (studentScore: number) => {
    setGradingExamId(null)
  }, [])

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set(exams.map(e => e.course))
    return Array.from(subjects).sort()
  }, [exams])

  const placeholders = [
    "Search by exam title...",
    "Search by course name...",
    "Search by year...",
    "Search Mat 202...",
  ]

  useEffect(() => {
    if (filters.query) return
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [filters.query, placeholders.length])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto ">
        <div className="">
          <div className="mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex-1 relative w-full md:w-auto">
                <div className="flex h-11 items-center gap-2 rounded-full bg-[#e8ddd0] dark:bg-[#1a1f3a] border border-black/10 dark:border-[#2a2f4a] px-4 py-4 relative">
                  <HugeiconsIcon icon={SearchIcon} size={23} color="currentColor" className="z-10" />
                  <div className="relative flex-1">
                    <input
                      aria-label="Search exams"
                      placeholder=""
                      className="bg-transparent outline-none w-full text-sm relative z-10 dark:text-gray-100"
                      value={filters.query}
                      onChange={(e) => {
                        setFilters({ query: e.target.value })
                        setShowSearchDropdown(e.target.value.length > 0)
                      }}
                      onFocus={() => filters.query && setShowSearchDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                    />
                    {!filters.query && (
                      <div className="absolute inset-0 flex items-center pointer-events-none">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentPlaceholder}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-black/50 dark:text-gray-500"
                          >
                            {placeholders[currentPlaceholder]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  <IoMdArrowDropdown className="text-[#4B4B4B] dark:text-gray-400 z-10" size={18} />
                </div>
                {showSearchDropdown && filtered.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-full bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-lg border border-black/10 dark:border-[#2a2f4a] p-2 z-50 max-h-[400px] overflow-auto"
                  >
                    {filtered.slice(0, 5).map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => {
                          setFilters({ query: exam.title })
                          setShowSearchDropdown(false)
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-[#e8ddd0] dark:hover:bg-[#252b4a] transition-colors"
                      >
                        <p className="font-medium text-sm dark:text-gray-100">{exam.title}</p>
                        <p className="text-xs text-black/60 dark:text-gray-400 mt-1">{exam.course} • {exam.year}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex-1 md:flex-none flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="h-11 inline-flex items-center gap-2 rounded-full bg-[#e8ddd0] dark:bg-[#1a1f3a] border border-black/10 dark:border-[#2a2f4a] px-4 text-sm hover:bg-[#dccfbe] dark:hover:bg-[#252b4a] transition-colors"
                >
                  <HugeiconsIcon icon={CalendarIcon} size={16} color="currentColor" />
                  <span className="dark:text-gray-200">21 - 24 November</span>
                  <IoMdArrowDropdown className="text-[#4B4B4B] dark:text-gray-400" size={18} />
                </button>
                {showDateDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-56 bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-lg border border-black/10 dark:border-[#2a2f4a] p-2 z-50"
                  >
                    <button
                      onClick={() => {
                        setFilters({ dateRange: null })
                        setShowDateDropdown(false)
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#e8ddd0] dark:hover:bg-[#252b4a] transition-colors text-sm dark:text-gray-100"
                    >
                      All Dates
                    </button>
                    <button
                      onClick={() => {
                        setFilters({ dateRange: "21-24" })
                        setShowDateDropdown(false)
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#e8ddd0] dark:hover:bg-[#252b4a] transition-colors text-sm dark:text-gray-100"
                    >
                      21 - 24 November
                    </button>
                  </motion.div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="h-11 inline-flex items-center gap-2 rounded-full bg-[#e8ddd0] dark:bg-[#1a1f3a] border border-black/10 dark:border-[#2a2f4a] px-4 text-sm hover:bg-[#dccfbe] dark:hover:bg-[#252b4a] transition-colors"
                >
                  <HugeiconsIcon icon={Calculator01Icon} size={16} color="currentColor" />
                  <span className="dark:text-gray-200">{filters.subject || "All Subjects"}</span>
                  <IoMdArrowDropdown className="text-[#4B4B4B] dark:text-gray-400" size={18} />
                </button>
                {showSubjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-56 bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-lg border border-black/10 dark:border-[#2a2f4a] p-2 z-50 max-h-[300px] overflow-auto"
                  >
                    <button
                      onClick={() => {
                        setFilters({ subject: null })
                        setShowSubjectDropdown(false)
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#e8ddd0] dark:hover:bg-[#252b4a] transition-colors text-sm dark:text-gray-100"
                    >
                      All Subjects
                    </button>
                    {uniqueSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setFilters({ subject })
                          setShowSubjectDropdown(false)
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-[#e8ddd0] dark:hover:bg-[#252b4a] transition-colors text-sm dark:text-gray-100"
                      >
                        {subject}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
                </div>
                <AnimatedThemeToggler className="h-10 w-10 rounded-full bg-[#e8ddd0] dark:bg-[#1a1f3a] border border-black/10 dark:border-[#2a2f4a] flex items-center justify-center hover:scale-105 transition-transform shrink-0" />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative">
          {filtered.map((e, idx) => (
            <div
              key={e.id}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    className="absolute -inset-2 bg-[#d4c4b0] dark:bg-[#252b4a] rounded-2xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            <Card className="space-y-2.5 relative z-10">
              <div>
                <h3 className="font-semibold text-[15px] leading-tight dark:text-gray-100">{e.title}</h3>
                <p className="text-sm text-black/60 dark:text-gray-400 mt-0.5">{e.year}</p>
              </div>
              <div className="text-sm text-black/70 dark:text-gray-300 space-y-0.5">
                <div className="flex justify-between">
                  <span>Date Created:</span>
                  <span className="text-right">{e.dateCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date Due:</span>
                  <span className="text-right">{e.dateDue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="text-right"><span className="font-bold">{e.weight}</span> of final grade</span>
                </div>
                <div className="flex justify-between">
                  <span>Student Attempted:</span>
                  <span className="text-right">85/ <span className="font-bold">100</span></span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="rounded-full p-2 hover:bg-black/5" aria-label="Edit" onClick={() => { setEditingId(e.id); setModalOpen(true) }}>
                    <FiEdit size={20} />
                  </button>
                  <button className="rounded-full p-2 hover:bg-black/5" aria-label="Delete" onClick={() => deleteExam(e.id)}>
                    <HugeiconsIcon className="text-red-600" icon={Delete02Icon} size={20} color="currentColor" />
                  </button>
                </div>
                <GradeButton onClick={() => setGradingExamId(e.id)} />
              </div>
            </Card>
            </div>
          ))}
          </div>
        </div>
      </div>
      <BottomActionBar onCreate={() => setModalOpen(true)} onExport={() => downloadJson("exams.json", exams)} />
      <ExamFormModal
        open={modalOpen}
        editing={editing}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
      {gradingExam && (
        <GradingModal
          exam={gradingExam}
          onClose={handleCloseGrading}
          onSubmit={handleGradeSubmit(gradingExam.id)}
        />
      )}
    </div>
  )
}
