import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  FileCheck2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Building2,
    title: "Vendor registry",
    description:
      "Every vendor in one place, with category, contact, and a risk score you set and revisit.",
  },
  {
    icon: FileCheck2,
    title: "Document tracking",
    description:
      "Insurance certificates, SOC 2 reports, ISO 27001, and contracts — with expiration dates that matter.",
  },
  {
    icon: AlertTriangle,
    title: "Automatic status",
    description:
      "Every document is automatically Valid, Expiring soon, or Expired based on its real expiration date — never a stale flag.",
  },
  {
    icon: BarChart3,
    title: "Risk dashboard",
    description: "A live view of how many vendors sit in low, medium, and high risk bands.",
  },
  {
    icon: Users,
    title: "Team visibility",
    description: "Everyone on your team can see the same vendor and compliance picture.",
  },
  {
    icon: ShieldCheck,
    title: "Tenant isolation",
    description: "Every organization's data is scoped by tenant at the database query level.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-700" />
            <span className="font-serif text-lg font-semibold text-ink-900">Veridex</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
            Demo project — not a funded company
          </span>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
            Know which vendor is about to become a compliance problem
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500">
            Veridex tracks vendor insurance certificates, SOC 2 reports, and contracts in one
            place, and flags what&apos;s expiring before it lapses on you.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="md">Create a free organization</Button>
            </Link>
            <Link href="/login">
              <Button size="md" variant="secondary">
                View demo login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">
            The problem with tracking vendor compliance in a spreadsheet
          </h2>
          <p className="mt-3 text-ink-500">
            Procurement and ops teams manage dozens of vendors, each with insurance certificates
            and security reports that expire on their own schedule. Spreadsheets don&apos;t alert
            anyone, ownership gets lost, and by the time someone notices, a certificate has
            already lapsed. Veridex replaces the spreadsheet with a system that always knows what
            is current and what isn&apos;t.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
                  <feature.icon className="h-5 w-5 text-brand-700" />
                </div>
                <h3 className="mt-4 font-serif text-base font-semibold text-ink-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-brand-100/40">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">
            Where this project actually stands
          </h2>
          <p className="mt-3 text-sm text-ink-700">
            Veridex is a portfolio/demo project: a fictional product with a real, working
            application behind it — genuine authentication, a real Postgres-backed API, and a
            real multi-tenant data model. There are no real customers, no real revenue, and no
            claimed certifications. Team invitations, billing, file storage, and SSO are not
            implemented; see the project documentation for a full breakdown of what is real,
            what is demo data, and what is roadmap.
          </p>
        </div>
      </section>

      <footer className="mt-auto border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-ink-500">
          Veridex is a demo project built to showcase product and engineering work. Not a real
          company.
        </div>
      </footer>
    </div>
  );
}
