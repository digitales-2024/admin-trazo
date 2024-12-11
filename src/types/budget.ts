import { FullCategory } from "./category";

export type Budget = {
    id: string;
    name: string;
    code: string;
    codeBudget: string;
    ubication: string;
    status: string;
    dateProject: string;
    clientBudget: Client;
    designProjectBudget?: DesignProject;
    budgetDetail: BudgetDetail[];
    category: CategoryBudget[];
};

export type CreateBudget = {
    name: string;
    ubication: string;
    dateProject: string;
    clientId: string;
    designProjectId?: string;
    directCost: number;
    overhead: number;
    utility: number;
    igv: number;
    percentageOverhead: number;
    percentageUtility: number;
    discount: number;
    totalCost: number;
    category: {
        categoryId: string;
        subtotal: number;
        subcategory: {
            subcategoryId: string;
            subtotal: number;
            workItem: {
                quantity?: number;
                unitCost?: number;
                subtotal: number;
                workItemId: string;
                apuBugdetId?: string;
                subWorkItem?: {
                    quantity: number;
                    unitCost: number;
                    subtotal: number;
                    subWorkItemId: string;
                    apuBugdetId?: string;
                }[];
            }[];
        }[];
    }[];
};

export type BudgetSummary = {
    id: string;
    name: string;
    code: string;
    codeBudget: string;
    ubication: string;
    status: string;
    dateProject: string;
    clientBudget: Client;
    designProjectBudget?: DesignProject;
};

export type Client = {
    id: string;
    name: string;
};

export type DesignProject = {
    id: string;
    code: string;
};

export enum BudgetStatusType {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type BudgetDetail = {
    id: string;
    directCost: number;
    overhead: number;
    utility: number;
    igv: number;
    discount: number;
    percentageOverhead: number;
    percentageUtility: number;
    totalCost: number;
};

export type CategoryBudget = {
    id: string;
    budgetDetailId?: string;
    name: string;
    subtotal: number;
    subcategory: Subcategory[];
};

export type Subcategory = {
    id: string;
    categoryId?: string;
    name: string;
    subtotal: number;
    workItem: WorkItem[];
};
export type WorkItem = {
    id: string;
    subcategoryId?: string;
    name: string;
    unit?: string;
    quantity?: number;
    unitCost?: number;
    subtotal: number;
    apuId?: string;
    subWorkItems?: SubWorkItem[];
};

export type SubWorkItem = {
    id: string;
    workItemId?: string;
    name: string;
    unit?: string;
    quantity: number;
    unitCost: number;
    apuId: string;
    subtotal: number;
};

export type DataItem = {
    name: string;
    value: number;
};
export interface BudgetCategories {
    categories: FullCategory[];
    overheadPercentage: number;
    profitPercentage: number;
    taxPercentage: number;
    commercialDiscount: number;
    applyTax: boolean;
}
