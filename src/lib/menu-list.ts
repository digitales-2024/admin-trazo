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
    PencilRuler,
    ScrollText,
    Anvil,
    LayoutList,
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
                            href: "/design-project/design",
                            label: "Proyectos",
                            active: pathname.includes("/design-project/design"),
                            icon: FolderRoot,
                        },
                        {
                            href: "/design-project/charter",
                            label: "Acta de Proyecto",
                            active: pathname.includes("/charter"),
                            icon: ScrollText,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Proyecto en Ejecución",
                    active: pathname.includes("/execution-project"),
                    icon: Hammer,
                    submenus: [
                        {
                            href: "/execution-project/budgets",
                            label: "Presupuestos",
                            active: pathname.endsWith("/budgets"),
                            icon: FileChartColumnIncreasing,
                        },
                        {
                            href: "/execution-project/budgets/category",
                            label: "Categorías",
                            active: pathname.endsWith("/budgets/category"),
                            icon: LayoutList,
                        },
                        {
                            href: "/execution-project/execution",
                            label: "Proyectos",
                            active: pathname.includes(
                                "/execution-project/execution",
                            ),
                            icon: FolderRoot,
                        },
                        {
                            href: "/execution-project/categories",
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
                    href: "/resources",
                    label: "Recursos",
                    active: pathname.includes("/resources"),
                    icon: Anvil,
                    submenus: [],
                },

                {
                    href: "/zoning",
                    label: "Zonificaciones",
                    active: pathname.includes("/zoning"),
                    icon: PencilRuler,
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
