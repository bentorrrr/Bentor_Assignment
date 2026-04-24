import { z } from "zod"

const nameField = (label: string) =>
  z
    .string()
    .min(1, `กรุณากรอก${label}`)
    .max(50, `${label}ยาวเกินไป`)
    .regex(/^[a-zA-Zก-๙\s]+$/, `${label}ต้องเป็นตัวอักษรเท่านั้น`)

export const personApiSchema = z.object({
  firstName:   nameField("ชื่อ"),
  lastName:    nameField("นามสกุล"),
  dateOfBirth: z.coerce.date().refine((date) => date <= new Date(), "วันเกิดต้องไม่อยู่ในอนาคต"),
  address:     z.string().trim().min(1, "กรุณากรอกที่อยู่").max(200, "ที่อยู่ยาวเกินไป"),
})

export const personFormSchema = personApiSchema.extend({
  dateOfBirth: z
    .date({ error: () => "กรุณาเลือกวันเกิด" })
    .refine((date) => date <= new Date(), "วันเกิดต้องไม่อยู่ในอนาคต"),
})

export type PersonApiInput = z.infer<typeof personApiSchema>
export type PersonFormInput = z.infer<typeof personFormSchema>
