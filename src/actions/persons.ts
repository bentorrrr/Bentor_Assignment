"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const personSchema = z.object({
  firstName: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(50, "ชื่อยาวเกินไป")
    .regex(/^[a-zA-Zก-๙\s]+$/, "ชื่อต้องเป็นตัวอักษรเท่านั้น"),
  lastName: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(50, "นามสกุลยาวเกินไป")
    .regex(/^[a-zA-Zก-๙\s]+$/, "นามสกุลต้องเป็นตัวอักษรเท่านั้น"),
  dateOfBirth: z.date({ required_error: "กรุณาเลือกวันเกิด" }),
  address: z.string().trim().min(5, "กรุณากรอกที่อยู่ให้ครบถ้วน").max(200, "ที่อยู่ยาวเกินไป"),
})

export async function createPerson(data: unknown) {
  const parsed = personSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  await prisma.person.create({ data: parsed.data })
  revalidatePath("/")
  return { success: true }
}

export async function updatePerson(id: string, data: unknown) {
  const parsed = personSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  await prisma.person.update({ where: { id }, data: parsed.data })
  revalidatePath("/")
  return { success: true }
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } })
  revalidatePath("/")
  return { success: true }
}

export async function getPersons() {
  return prisma.person.findMany({ orderBy: { createdAt: "desc" } })
}
