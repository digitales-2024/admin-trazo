"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { Navbar } from "./_components/Navbar";
import { AppSidebar } from "./_components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />

                <main
                    className={cn(
                        "w-full bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
                    )}
                >
                    <Navbar />
                    <div className="container mx-auto px-4 pb-8 pt-8 sm:px-8">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}
