"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { RiskScoreBadge, VendorStatusBadge } from "@/components/vendors/status-badges";
import type { Vendor, VendorStatus } from "@/lib/types";
import { Building2, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusFilters: { value: VendorStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At risk" },
  { value: "OFFBOARDED", label: "Offboarded" },
];

export function VendorsTable({ vendors }: { vendors: Vendor[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VendorStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesStatus = status === "ALL" || vendor.status === status;
      const matchesQuery =
        query.trim().length === 0 ||
        vendor.name.toLowerCase().includes(query.toLowerCase()) ||
        vendor.category.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [vendors, query, status]);

  if (vendors.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No vendors yet"
        description="Add your first vendor to start tracking compliance documents and risk."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            placeholder="Search vendors…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-md border border-border-strong bg-surface p-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                status === filter.value
                  ? "bg-brand-700 text-white"
                  : "text-ink-700 hover:bg-brand-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching vendors"
          description="Try a different search term or filter."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filtered.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-brand-100/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="font-medium text-ink-900 hover:text-brand-700"
                    >
                      {vendor.name}
                    </Link>
                    <p className="text-xs text-ink-500">{vendor.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{vendor.category}</td>
                  <td className="px-4 py-3">
                    <RiskScoreBadge score={vendor.riskScore} />
                  </td>
                  <td className="px-4 py-3">
                    <VendorStatusBadge status={vendor.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-700">{vendor.documents.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
