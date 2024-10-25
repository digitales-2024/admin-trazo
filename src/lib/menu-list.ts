import {
    Users,
    LayoutGrid,
    LucideIcon,
    BookUser,
    Clipboard,
    BriefcaseBusiness,
    User,
    KeyRound,
    NotebookPen,
    FileSpreadsheet,
    FolderRoot,
    Hammer,
    FileChartColumnIncreasing,
    BrickWall,
    HousePlusIcon,
    GalleryHorizontalEnd,
} from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/",
                    label: "Dashboard",
                    active: "/" === pathname,
                    icon: LayoutGrid,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Módulos",
            menus: [
                {
                    href: "",
                    label: "Proyecto de Diseño",
                    active: pathname.includes("/design-project"),
                    icon: NotebookPen,
                    submenus: [
                        {
                            href: "/design-project/quotation",
                            label: "Cotización",
                            active: pathname.includes("/quotation"),
                            icon: FileSpreadsheet,
                        },
                        {
                            href: "/design-project/categories",
                            label: "Proyectos",
                            active: pathname.includes("/projects"),
                            icon: FolderRoot,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Proyecto en Ejecución",
                    active: pathname.includes("/design-project"),
                    icon: Hammer,
                    submenus: [
                        {
                            href: "/design-project/quotation",
                            label: "Presupuestos",
                            active: pathname.includes("/quotation"),
                            icon: FileChartColumnIncreasing,
                        },
                        {
                            href: "/design-project/categories",
                            label: "Proyectos",
                            active: pathname.includes("/projects"),
                            icon: FolderRoot,
                        },
                        {
                            href: "/design-project/categories",
                            label: "Adicionales",
                            active: pathname.includes("/projects"),
                            icon: HousePlusIcon,
                        },
                        {
                            href: "/design-project/categories",
                            label: "Acabados",
                            active: pathname.includes("/projects"),
                            icon: BrickWall,
                        },
                    ],
                },
                {
                    href: "/clients",
                    label: "Clientes",
                    active: pathname.includes("/clients"),
                    icon: BookUser,
                    submenus: [],
                },
                {
                    href: "/spaces",
                    label: "Ambientes",
                    active: pathname.includes("/spaces"),
                    icon: GalleryHorizontalEnd,
                    submenus: [],
                },
                {
                    href: "/reports",
                    label: "Reportes",
                    active: pathname.includes("/reports"),
                    icon: Clipboard,
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Configuración",
            menus: [
                {
                    href: "/users",
                    label: "Usuarios",
                    active: pathname.includes("/users"),
                    icon: Users,
                    submenus: [
                        {
                            href: "/users",
                            label: "Usuarios",
                            active: pathname === "/users",
                            icon: User,
                        },
                        {
                            href: "/users/roles",
                            label: "Roles",
                            active: pathname.includes("/roles"),
                            icon: BookUser,
                        },
                        {
                            href: "/users/permissions",
                            label: "Permisos",
                            active: pathname.includes("/permissions"),
                            icon: KeyRound,
                        },
                    ],
                },
                {
                    href: "/business",
                    label: "Negocio",
                    active: pathname.includes("/bussiness"),
                    icon: BriefcaseBusiness,
                    submenus: [],
                },
            ],
        },
    ];
}
