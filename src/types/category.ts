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
    subWorkItems: SubworkItemDragCategory[];
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
    unit?: string;
    unitCost?: number;
    subcategories?: DragCategoriesItem[];
    workItems?: DragCategoriesItem[];
    subWorkItems?: DragCategoriesItem[];
}
export interface CategoryGet {
    id: string;
    name: string;
    isActive: boolean;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    isActive: boolean;
    workItems: WorkItem[];
}

export interface WorkItem {
    id: string;
    name: string;
    unit?: string | null;
    unitCost?: number | null;
    apuId?: string | null;
    isActive: boolean;
    subWorkItems: SubWorkItem[];
}

export interface SubWorkItem {
    id: string;
    name: string;
    unit: string;
    unitCost: number;
    apuId: string;
    isActive: boolean;
}

export type GenericTableItem = {
    id: string;
    name: string;
    unit?: string | null;
    unitCost?: number | null;
    apuId?: string | null;

    isActive: boolean;
    entityName: EntityType;

    children: Array<GenericTableItem>;
};

/**
 * Keeps track of what type of entity was the original data.
 */
export type EntityType =
    | "Category"
    | "Subcategory"
    | "Workitem"
    | "Subworkitem";
