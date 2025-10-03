"use client"
import { Exam, ExamDraft } from "@/lib/utils"
import { Button, Label } from "../ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dateDue: z.string().min(1, "Date is required"),
  course: z.string().min(1, "Course is required"),
  maxPoints: z.number().positive("Enter a positive number"),
  weight: z.string().regex(/^\d+%$/, "Enter percent like 35%"),
  passingThreshold: z.number().min(0, "Enter a valid number"),
  visible: z.boolean(),
})

type ExamFormData = z.infer<typeof examSchema>

type Props = {
  initial?: Partial<Exam>
  onCancel: () => void
  onSubmit: (data: ExamDraft) => void
}

export default function ExamForm({ initial, onCancel, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      dateDue: initial?.dateDue ?? "",
      course: initial?.course ?? "",
      maxPoints: initial?.maxPoints ?? 100,
      weight: initial?.weight ?? "35%",
      passingThreshold: initial?.passingThreshold ?? 50,
      visible: initial?.visible ?? true,
    },
  })

  const onFormSubmit = (data: ExamFormData) => {
    const examData: ExamDraft = {
      id: initial?.id,
      title: data.title,
      year: initial?.year ?? "YR 2",
      dateDue: data.dateDue,
      weight: data.weight,
      maxPoints: data.maxPoints,
      passingThreshold: data.passingThreshold,
      status: initial?.status ?? "Not Attempted",
      course: data.course,
      description: data.description ?? "",
      visible: data.visible,
    }
    onSubmit(examData)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
      <div>
        <Label htmlFor="title" className="text-black/80 font-normal text-sm mb-1.5 block">Exam Title</Label>
        <Input
          id="title"
          placeholder="Mat 201 Exam"
          {...register("title")}
          aria-invalid={!!errors.title}
          className="rounded-md border-black/10 bg-gray-100"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="desc" className="text-black/80 font-normal text-sm mb-1.5 block">Exam Description</Label>
        <Textarea
          id="desc"
          placeholder="Lorem ipsum dolor sit amet consectetur. Ornare verus es sed lacus pharetra mauris tempus tincidunt. A semper pretium sem aliquet integer. Placerat convallis urna risus"
          {...register("description")}
          className="rounded-md border-black/10 bg-gray-100 min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date" className="text-black/80 font-normal text-sm mb-1.5 block">Date</Label>
          <Controller
            name="dateDue"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full rounded-md border-black/10 bg-gray-100">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="November 21, 2025">November 21, 2025</SelectItem>
                  <SelectItem value="November 25, 2025">November 25, 2025</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.dateDue && <p className="mt-1 text-xs text-red-600">{errors.dateDue.message}</p>}
        </div>
        <div>
          <Label htmlFor="course" className="text-black/80 font-normal text-sm mb-1.5 block">Course</Label>
          <Input
            id="course"
            placeholder="Actuarial Vector Analysis"
            {...register("course")}
            className="rounded-md bg-gray-100"
          />
          {errors.course && <p className="mt-1 text-xs text-red-600">{errors.course.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-black/80 font-normal text-sm mb-1.5 block">Maximum Point</Label>
          <Input
            type="number"
            placeholder="100"
            {...register("maxPoints", { valueAsNumber: true })}
            className="rounded-md border-black/10 bg-gray-100"
          />
          {errors.maxPoints && <p className="mt-1 text-xs text-red-600">{errors.maxPoints.message}</p>}
        </div>
        <div>
          <Label className="text-black/80 font-normal text-sm mb-1.5 block">Weighted</Label>
          <Input
            placeholder="35%"
            {...register("weight")}
            className="rounded-md border-black/10 bg-gray-100"
          />
          {errors.weight && <p className="mt-1 text-xs text-red-600">{errors.weight.message}</p>}
        </div>
        <div>
          <Label className="text-black/80 font-normal text-sm mb-1.5 block">Passing Threshold</Label>
          <Input
            type="number"
            placeholder="50"
            {...register("passingThreshold", { valueAsNumber: true })}
            className="rounded-md border-black/10 bg-gray-100"
          />
          {errors.passingThreshold && <p className="mt-1 text-xs text-red-600">{errors.passingThreshold.message}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-black/90 font-semibold text-sm">Visible to all Students</Label>
        <Controller
          name="visible"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <span className="text-sm">Yes</span>
                <div className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${field.value ? 'border-[#f0d9be]' : 'border-black/20'}`}>
                  {field.value && <div className="h-3 w-3 rounded-full bg-[#f0d9be]" />}
                </div>
                <input
                  type="radio"
                  checked={field.value}
                  onChange={() => field.onChange(true)}
                  className="sr-only"
                />
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <span className="text-sm">No</span>
                <div className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${!field.value ? 'border-[#d4d4d4]' : 'border-black/20'}`}>
                  {!field.value && <div className="h-3 w-3 rounded-full bg-[#d4d4d4]" />}
                </div>
                <input
                  type="radio"
                  checked={!field.value}
                  onChange={() => field.onChange(false)}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="button" className="flex-1 bg-[#f0d9be] text-[#1b1b1b] hover:bg-[#e9ceb0] font-normal p-3" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 font-normal p-3">{initial?.id ? "Update" : "Create"}</Button>
      </div>
    </form>
  )
}
