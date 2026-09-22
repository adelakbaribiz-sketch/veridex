"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import type { ComplianceDocument, DocumentType } from "@/lib/types";

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "INSURANCE_CERT", label: "Insurance certificate" },
  { value: "SOC2_REPORT", label: "SOC 2 report" },
  { value: "ISO27001", label: "ISO 27001 certificate" },
  { value: "CONTRACT", label: "Contract" },
  { value: "OTHER", label: "Other" },
];

const schema = z.object({
  type: z.enum(["INSURANCE_CERT", "SOC2_REPORT", "ISO27001", "CONTRACT", "OTHER"]),
  fileName: z.string().min(3, "Enter a file name"),
  issuedAt: z.string().min(1, "Required"),
  expiresAt: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export function AddDocumentDialog({ vendorId }: { vendorId: string }) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "INSURANCE_CERT" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await apiClient.post<ComplianceDocument>(`vendors/${vendorId}/documents`, {
        ...values,
        issuedAt: new Date(values.issuedAt).toISOString(),
        expiresAt: new Date(values.expiresAt).toISOString(),
      });
      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add document
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Add compliance document">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Document type" htmlFor="type" error={errors.type?.message}>
            <select
              id="type"
              className="h-10 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
              {...register("type")}
            >
              {documentTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="File name" htmlFor="fileName" error={errors.fileName?.message}>
            <Input id="fileName" placeholder="certificate-of-insurance.pdf" {...register("fileName")} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Issued" htmlFor="issuedAt" error={errors.issuedAt?.message}>
              <Input id="issuedAt" type="date" {...register("issuedAt")} />
            </FormField>
            <FormField label="Expires" htmlFor="expiresAt" error={errors.expiresAt?.message}>
              <Input id="expiresAt" type="date" {...register("expiresAt")} />
            </FormField>
          </div>

          {submitError ? <p className="text-sm text-danger-600">{submitError}</p> : null}

          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add document"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
