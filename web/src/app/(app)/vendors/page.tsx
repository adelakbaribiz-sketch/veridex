import { PageHeader } from "@/components/shell/page-header";
import { CreateVendorDialog } from "@/components/vendors/create-vendor-dialog";
import { VendorsTable } from "@/components/vendors/vendors-table";
import { serverFetch } from "@/lib/api-server";
import type { Vendor } from "@/lib/types";

export default async function VendorsPage() {
  const vendors = (await serverFetch<Vendor[]>("vendors")) ?? [];

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Every vendor your organization tracks, with risk score and compliance status."
        actions={<CreateVendorDialog />}
      />
      <VendorsTable vendors={vendors} />
    </div>
  );
}
