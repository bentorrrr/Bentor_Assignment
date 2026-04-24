"use client";

import { Person } from "@/types/person";
import { useEffect } from "react";
import Modal from "@/components/shared/Modal";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateAge } from "@/lib/person/ageUtils";
import { personFormSchema, PersonFormInput } from "@/lib/validations/person";
import Button from "@/components/shared/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Mode = "create" | "edit" | "view";

interface PersonModalProps {
  mode: Mode;
  isOpen: boolean;
  onClose: () => void;
  initialData?: Person;
}

export default function PersonModal({
  mode,
  isOpen,
  onClose,
  initialData,
}: PersonModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PersonFormInput>({ resolver: zodResolver(personFormSchema) });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      address: initialData?.address ?? "",
      ...(initialData?.dateOfBirth && { dateOfBirth: initialData.dateOfBirth }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const dateOfBirth = watch("dateOfBirth");
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;

  const onSubmit = async (data: PersonFormInput) => {
    const url =
      mode === "edit" && initialData?.id
        ? `/api/persons/${initialData.id}`
        : "/api/persons";

    const res = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) return;
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "create"
          ? "Add New Person"
          : mode === "edit"
            ? "Edit Person"
            : "View Person"
      }
      footer={
        <div className="flex justify-end gap-2">
          {mode === "view" ? (
            <Button variant="cancel" onClick={onClose}>
              ปิด
            </Button>
          ) : (
            <>
              <Button onClick={handleSubmit(onSubmit)}>บันทึก</Button>
              <Button variant="cancel" onClick={onClose}>
                ยกเลิก
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Row 1: First name + Last name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ
            </label>
            <input
              {...register("firstName")}
              disabled={mode === "view"}
              placeholder="เช่น สมชาย"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.firstName && (
              <p className="text-danger text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สกุล
            </label>
            <input
              {...register("lastName")}
              disabled={mode === "view"}
              placeholder="เช่น ใจดี"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.lastName && (
              <p className="text-danger text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Date of birth + Age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันเกิด
            </label>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="เลือกวันเกิด"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  disabled={mode === "view"}
                  autoComplete="off"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                  wrapperClassName="w-full"
                />
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-danger text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อายุ
            </label>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <span className="text-sm font-semibold text-gray-900">
                {age !== null ? `${age} ปี` : "—"}
              </span>
              <span className="text-xs text-gray-400">คำนวณอัตโนมัติ</span>
            </div>
          </div>
        </div>

        {/* Row 3: Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
          <textarea
            {...register("address")}
            disabled={mode === "view"}
            placeholder="บ้านเลขที่ / ถนน / ตำบล / อำเภอ / จังหวัด"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500 resize-none"
          />
          {errors.address && (
            <p className="text-danger text-xs mt-1">{errors.address.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
