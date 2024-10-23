import {
    BookUser,
    BriefcaseBusiness,
    KeyRound,
    ScrollText,
    User,
} from "lucide-react";

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
            title: "Negocio",
            url: "/business",
            icon: BriefcaseBusiness,
        },
        {
            title: "Usuarios",
            url: "/users",
            icon: User,
        },
        {
            title: "Roles",
            url: "/users/roles",
            icon: BookUser,
        },
        {
            title: "Permisos",
            url: "/users/permissions",
            icon: KeyRound,
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
                    <a href="/">
                        <img
                            className="inline-block"
                            src="https://www.trazoarq.com/wp-content/uploads/2021/05/logo-30.svg"
                            alt="Logo Trazo"
                        />
                    </a>
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
