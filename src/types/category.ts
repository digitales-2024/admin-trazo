export type Category = {
    id: string;
    name: string;
    isActive: boolean;
};

export type FullCategory = {
    id: string;
    name: string;
    type?: "category" | "subcategory" | "workItem" | "subWorkItem";
    isActive?: boolean;
    subcategories: SubcategoryDragCategory[];
};

export type SubcategoryDragCategory = {
    id: string;
    name: string;
    type?: "category" | "subcategory" | "workItem" | "subWorkItem";
    isActive?: boolean;
    workItems: WorkItemDragCategory[];
};

export type WorkItemDragCategory = {
    id: string;
    name: string;
    unit?: string;
    unitCost?: number;
    apuId?: string;
    quantity?: number;
    type?: "category" | "subcategory" | "workItem" | "subWorkItem";
    isActive?: boolean;
    subworkItem: SubworkItemDragCategory[];
};

export type SubworkItemDragCategory = {
    id: string;
    name: string;
    unit?: string;
    quantity?: number;
    unitCost?: number;
    apuId?: string;
    type?: "category" | "subcategory" | "workItem" | "subWorkItem";
    isActive?: boolean;
};

export interface DragCategoriesItem {
    id: string;
    name: string;
    isActive?: boolean;
    type?: "category" | "subcategory" | "workItem" | "subWorkItem";
    subcategories?: DragCategoriesItem[];
    workItems?: DragCategoriesItem[];
    subWorkItems?: DragCategoriesItem[];
}
