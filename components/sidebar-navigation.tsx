"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Gift, Users } from "lucide-react";

export function SidebarNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 h-full">
      <nav className="space-y-2">
        <Link href="/donations" className="block mb-2">
          <div
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive("/donations")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Gift className="w-5 h-5" />
            Donations
          </div>
        </Link>
        <Link href="/friends" className="block mb-2">
          <div
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive("/friends")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5" />
            Friends
          </div>
        </Link>
      </nav>
    </aside>
  );
}
