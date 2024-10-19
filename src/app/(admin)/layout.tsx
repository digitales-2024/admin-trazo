"use client";

import { adminApi } from "@/redux/services/adminApi";

import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { useProfileQuery } = adminApi;
    const data = useProfileQuery();

    // TODO: This is here to manually trigger the user profile query.
    // Remove once the profile is used elsewhere
    console.log("data from useProfileQuery:", data);

    return (
        <div>
            <aside
                className={cn(
                    "fixed left-0 top-0 z-20 h-screen w-40 -translate-x-full border-r-[1px] border-slate-100 transition-[width] duration-300 ease-in-out lg:translate-x-0",
                )}
            >
                <div className="bg-black p-4">
                    <img
                        className="inline-block"
                        src="https://www.trazoarq.com/wp-content/uploads/2021/05/logo-30.svg"
                        alt="Logo Trazo"
                    />
                </div>
            </aside>

            <main
                className={cn(
                    "min-h-screen pl-40 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
                )}
            >
                <div className="container mx-auto px-4 pb-8 pt-8 sm:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
