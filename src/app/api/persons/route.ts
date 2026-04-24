import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { personApiSchema } from "@/lib/validations/person"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""

    const persons = await prisma.person.findMany({
      where: {
        isDeleted: false,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(persons)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = personApiSchema.safeParse(body)

    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

    const person = await prisma.person.create({ data: parsed.data })
    return NextResponse.json(person, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

