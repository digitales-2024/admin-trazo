"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { UserNav } from "./UserNav";

export const Navbar = () => (
    <header className="sticky top-0 z-10 w-full bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar">
        <div className="mx-4 flex h-14 items-center sm:mx-8">
            <SidebarTrigger />
            <div className="flex items-center space-x-4 lg:space-x-0" />
            <div className="flex flex-1 items-center justify-end gap-2 space-x-2">
                <UserNav />
            </div>
        </div>
    </header>
);
