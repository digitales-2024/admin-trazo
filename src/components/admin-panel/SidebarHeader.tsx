import Image from "next/image";
import Link from "next/link";

interface SidebarHeaderProps {
    isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
    return (
        <Link href="/">
            <div
                className={`cursor-pointer px-8 py-4 ${isOpen ? "open" : "closed"}`}
            >
                <div className="rounded bg-black p-2">
                    <Image
                        className="inline-block"
                        src="https://www.trazoarq.com/wp-content/uploads/2021/05/logo-30.svg"
                        alt="Logo Trazo"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
        </Link>
    );
};
