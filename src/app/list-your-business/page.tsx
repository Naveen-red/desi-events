import type { Metadata } from "next";
import { ListBusinessForm } from "@/components/list-business-form";

export const metadata: Metadata = { title: "List your business" };

export default function ListYourBusinessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">List your business — it&apos;s free</h1>
      <p className="mt-2 text-muted">
        Reach Indian families planning weddings, sangeets, pujas and birthdays in your city. No fees, no commissions.
      </p>
      <div className="mt-8">
        <ListBusinessForm />
      </div>
    </div>
  );
}
