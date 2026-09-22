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
import type { Vendor } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Enter a vendor name"),
  category: z.string().min(2, "Enter a category"),
  contactEmail: z.string().email("Enter a valid email"),
  riskScore: z
    .string()
    .optional()
    .refine((value) => !value || (Number(value) >= 0 && Number(value) <= 100), {
      message: "Enter a number between 0 and 100",
    }),
});

type FormValues = z.infer<typeof schema>;

export function CreateVendorDialog() {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await apiClient.post<Vendor>("vendors", {
        ...values,
        riskScore: values.riskScore ? Number(values.riskScore) : undefined,
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
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add vendor
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Add a vendor">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Vendor name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" placeholder="Northwind Logistics" {...register("name")} />
          </FormField>
          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <Input id="category" placeholder="Logistics" {...register("category")} />
          </FormField>
          <FormField label="Contact email" htmlFor="contactEmail" error={errors.contactEmail?.message}>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@vendor.com"
              {...register("contactEmail")}
            />
          </FormField>
          <FormField label="Initial risk score (0–100)" htmlFor="riskScore" error={errors.riskScore?.message}>
            <Input id="riskScore" type="number" min={0} max={100} placeholder="20" {...register("riskScore")} />
          </FormField>

          {submitError ? <p className="text-sm text-danger-600">{submitError}</p> : null}

          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding…" : "Add vendor"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
