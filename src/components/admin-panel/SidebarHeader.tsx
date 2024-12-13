import { LogoTrazo } from "@/assets/icons/LogoTrazo";
import { LogoTrazoTriangule } from "@/assets/icons/LogoTrazoTriangule";
import Link from "next/link";

interface SidebarHeaderProps {
    isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
    return (
        <Link href="/">
            <div
                className={` ${isOpen ? "open px-8 py-3" : "closed items-center justify-center py-2"} flex items-center justify-center`}
            >
                <div
                    className={`inline-flex items-center justify-center justify-items-center rounded bg-black p-2 ${isOpen ? "w-full" : ""}`}
                >
                    {isOpen ? (
                        <LogoTrazo />
                    ) : (
                        <LogoTrazoTriangule className="hover:animate-bounce" />
                    )}
                </div>
            </div>
        </Link>
    );
};
