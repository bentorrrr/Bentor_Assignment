"use client"

import { useState, useMemo, useEffect } from "react"
import { calculateAge } from "@/lib/person/ageUtils"
import PersonModal from "./PersonModal"
import Modal from "@/components/shared/Modal"
import Button from "@/components/shared/Button"

export type PersonRow = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  address: string
  createdAt: string
  updatedAt: string
}

type Mode = "create" | "edit" | "view"

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

function getInitials(firstName: string, lastName: string) {
  return (firstName[0] ?? "").toUpperCase() + (lastName[0] ?? "").toUpperCase()
}

export default function PersonsTable({ initialPersons }: { initialPersons: PersonRow[] }) {
  const [persons, setPersons] = useState<PersonRow[]>(initialPersons)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("create")
  const [selected, setSelected] = useState<PersonRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PersonRow | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return persons.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    )
  }, [persons, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search])

  async function refetch() {
    const res = await fetch("/api/persons")
    if (res.ok) {
      const data = await res.json()
      setPersons(data)
    }
  }

  function openModal(mode: Mode, person?: PersonRow) {
    setMode(mode)
    setSelected(person ?? null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelected(null)
    refetch()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await fetch(`/api/persons/${deleteTarget.id}`, { method: "DELETE" })
    setDeleteTarget(null)
    refetch()
  }

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">รายชื่อบุคคล</h1>
            <p className="text-xs text-gray-500">ข้อมูลทั้งหมด {persons.length} รายการ</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อ หรือที่อยู่..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </div>
            <Button onClick={() => openModal("create")}>+ Add</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-semibold w-16">ID</th>
                <th className="text-left px-6 py-3 font-semibold w-64">ชื่อ-สกุล</th>
                <th className="text-left px-6 py-3 font-semibold">ที่อยู่</th>
                <th className="text-left px-6 py-3 font-semibold w-32">วันเกิด</th>
                <th className="text-left px-6 py-3 font-semibold w-20">อายุ</th>
                <th className="text-right px-6 py-3 font-semibold w-36">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <p className="text-base font-medium">ยังไม่มีข้อมูล</p>
                    <p className="text-sm mt-1">กด Add เพื่อเริ่มต้น</p>
                  </td>
                </tr>
              ) : (
                paginated.map((person, index) => (
                  <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      #{String((page - 1) * PAGE_SIZE + index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {getInitials(person.firstName, person.lastName)}
                        </span>
                        <span className="font-medium text-gray-900">{person.firstName} {person.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{person.address}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(person.dateOfBirth)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{calculateAge(new Date(person.dateOfBirth))} ปี</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <button onClick={() => openModal("view", person)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-primary hover:bg-indigo-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button onClick={() => openModal("edit", person)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => setDeleteTarget(person)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-danger hover:bg-red-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            แสดง {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  p === page
                    ? "bg-primary text-white border-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <PersonModal
        isOpen={modalOpen}
        onClose={closeModal}
        mode={mode}
        initialData={selected ? { ...selected, dateOfBirth: new Date(selected.dateOfBirth) } : undefined}
      />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบ"
        description={`ต้องการลบข้อมูลของ ${deleteTarget?.firstName} ${deleteTarget?.lastName} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="cancel" onClick={confirmDelete}>ลบ</Button>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>ยกเลิก</Button>
          </div>
        }
      >
        <></>
      </Modal>
    </>
  )
}
