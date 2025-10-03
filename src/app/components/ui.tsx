"use client"
import { cn } from "@/lib/utils"
import { X, Download, PlusCircle, Sparkle } from "lucide-react"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"
import { forwardRef, useEffect, useState, useMemo } from "react"
import { loadFull } from "tsparticles"
import type { ISourceOptions } from "@tsparticles/engine"
import Particles, { initParticlesEngine } from "@tsparticles/react"

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        "bg-[#101622] text-white hover:bg-[#0b1120] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
        className
      )}
      {...props}
    />
  )
}

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function TI(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-black/10 bg-gray-100 px-4 py-2.5 text-sm outline-none",
        "focus:ring-2 focus:ring-black/10",
        className
      )}
      {...props}
    />
  )
})

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function TA(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-black/10 bg-gray-100 px-4 py-3 text-sm outline-none min-h-[120px]",
        "focus:ring-2 focus:ring-black/10",
        className
      )}
      {...props}
    />
  )
})

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold", props.className)} {...props} />
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl bg-[#e8ddd0] dark:bg-[#1a1f3a] p-4 shadow-sm border border-black/5 dark:border-[#2a2f4a]", className)} {...props} />
}

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("hidden md:flex md:w-64 p-4", className)} {...props} />
}

export function Topbar({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

// Pills for search/filters to match the design
export function Pill({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[#efe6dd] border border-black/10 px-4 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// 3D hover tilt wrapper for cards
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateX.set((py - 0.5) * -8)
    rotateY.set((px - 0.5) * 8)
  }
  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }
  return (
    <motion.div
      className={cn("[perspective:1000px]", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </motion.div>
  )
}

const particleOptions: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
}

// Animated "Grade Now" button with sparkle effect
export function GradeButton({ children = "Grade Now", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">()
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine)
    }).then(() => {
      setParticlesReady("loaded")
    })
  }, [])

  const modifiedOptions = useMemo(() => {
    const opts = { ...particleOptions }
    opts.autoPlay = isHovering
    return opts
  }, [isHovering])

  return (
    <button
      className={cn(
        "group relative rounded-full bg-[#101622] transition-transform hover:scale-110 active:scale-105",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <div className="relative flex items-center justify-center gap-2 rounded-full px-6 py-2">
        <Sparkle className="size-4 -translate-y-0.5 animate-sparkle fill-white" />
        <Sparkle
          style={{
            animationDelay: "1s",
          }}
          className="absolute bottom-2 left-2 z-20 size-1.5 rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-4 top-2 size-1 -rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "0.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-2.5 top-2.5 size-1 animate-sparkle fill-white"
        />

        <span className="font-semibold text-sm text-white">{children}</span>
      </div>
      {!!particleState && (
        <Particles
          id={`particles-${Math.random()}`}
          className={cn(
            "pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity",
            particleState === "ready" && "group-hover:opacity-100"
          )}
          particlesLoaded={async () => {
            setParticlesReady("ready")
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  )
}

export function BottomActionBar({
  onCreate,
  onExport,
}: {
  onCreate: () => void
  onExport: () => void
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-6">
      <div className="pointer-events-auto w-full max-w-6xl flex justify-end">
        <div className="flex items-center gap-2">
          <Button className="bg-[#f0d9be] text-[#1b1b1b] hover:bg-[#e9ceb0] p-4" onClick={onCreate}>
            <span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create New Exam</span>
          </Button>
          <Button onClick={onExport} className="bg-[#101622] px-8 py-4">
            <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" /> Export</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-[#f3e6d9] dark:bg-[#1a1f3a] p-6 border border-black/10 dark:border-[#2a2f4a]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black/90 dark:text-gray-100">{title}</h3>
              <button aria-label="Close" onClick={onClose} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <X className="h-5 w-5 text-black/80 dark:text-gray-300" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


