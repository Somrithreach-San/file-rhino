import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { SideNav } from "./side-nav";
import UploadButton from "./_components/upload-button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <div className="w-40 flex flex-col gap-4">
          <UploadButton />
          <SideNav />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
