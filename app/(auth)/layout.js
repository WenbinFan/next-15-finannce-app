import { sizes, variants } from "@/lib/variants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({children}) {
  return <main>
    <div className="absolute left-8 top-8"></div>
    <Link href="/" className={`${variants['ghost']} ${sizes['base']} flex items-center space-x-2 text-sm mt-4`}>
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
    </Link>
    <div className="mt-8">
        {children}
    </div>
  </main>
}