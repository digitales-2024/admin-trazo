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
