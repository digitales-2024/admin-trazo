export type Category = {
    id: string;
    name: string;
    isActive: boolean;
};

export type FullCategory = {
    id: string;
    name: string;
    isActive: boolean;
    subcategories: Subcategory[];
};

type Subcategory = {
    id: string;
    name: string;
    isActive: boolean;
    workItems: WorkItem[];
};

type WorkItem = {
    id: string;
    name: string;
    unit?: string;
    unitCost?: number;
    apuId?: string;
    isActive: boolean;
    subworkItem?: SubworkItem[];
};

type SubworkItem = {
    id: string;
    name: string;
    unit?: string;
    unitCost?: number;
    apuId?: string;
    isActive: boolean;
};
