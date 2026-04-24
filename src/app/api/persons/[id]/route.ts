import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { personApiSchema } from "@/lib/validations/person"

type Params = { params: Promise<{ id: string }> }

async function findPerson(id: string) {
  return prisma.person.findUnique({ where: { id, isDeleted: false } })
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const person = await findPerson(id)

    if (!person)
      return NextResponse.json({ error: "Person not found" }, { status: 404 })

    return NextResponse.json(person)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const person = await findPerson(id)

    if (!person)
      return NextResponse.json({ error: "Person not found" }, { status: 404 })

    const body = await req.json()
    const parsed = personApiSchema.safeParse(body)

    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

    const updated = await prisma.person.update({ where: { id }, data: parsed.data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const person = await findPerson(id)

    if (!person)
      return NextResponse.json({ error: "Person not found" }, { status: 404 })

    await prisma.person.update({ where: { id }, data: { isDeleted: true } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
