"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  BarChart2,
  Award,
  Settings,
  CreditCard,
  Bell,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Wins", href: "/admin/wins", icon: Award },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        isActive
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 