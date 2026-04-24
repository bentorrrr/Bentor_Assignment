import { prisma } from "@/lib/prisma"
import PersonsTable from "@/components/persons/PersonsTable"

export default async function Page() {
  const persons = await prisma.person.findMany({ where: { isDeleted: false }, orderBy: { createdAt: "asc" } })

  const serialized = persons.map((p) => ({
    ...p,
    dateOfBirth: p.dateOfBirth.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto">
        <PersonsTable initialPersons={serialized} />
      </div>
    </main>
  )
}
