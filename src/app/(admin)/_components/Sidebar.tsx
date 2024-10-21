import { ScrollText, User } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
    const items = [
        {
            title: "Usuarios",
            url: "/users",
            icon: User,
        },
        {
            title: "Registros",
            url: "/logging",
            icon: ScrollText,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader className="px-8 py-4">
                <div className="rounded bg-black p-2">
                    <img
                        className="inline-block"
                        src="https://www.trazoarq.com/wp-content/uploads/2021/05/logo-30.svg"
                        alt="Logo Trazo"
                    />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Administración</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
