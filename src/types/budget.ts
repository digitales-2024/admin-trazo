export type Budget = {
    id: string;
    name: string;
    code: string;
    codeBudget: string;
    ubication: string;
    status: string;
    dateProject: string;
    client: Client;
    designProject?: DesignProject;
    budgetDetails: BudgetDetail[];
    category: CategoryBudget[];
};

export type BudgetSummary = {
    id: string;
    name: string;
    code: string;
    codeBudget: string;
    ubication: string;
    status: string;
    dateProject: string;
    client: Client;
    designProject?: DesignProject;
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
    percentageOverhead: number;
    percentageUtility: number;
    totalCost: number;
};

export type CategoryBudget = {
    id: string;
    budgetDetailId?: string;
    name: string;
    subcategory: Subcategory[];
};

export type Subcategory = {
    id: string;
    categoryId?: string;
    name: string;
    workItem: WorkItem[];
};
export type WorkItem = {
    id: string;
    subcategoryId?: string;
    name: string;
    quantity?: number;
    unitCost?: number;
    subtotal: number;
    subWorkItem?: SubWorkItem[];
};

export type SubWorkItem = {
    id: string;
    workItemId?: string;
    name: string;
    quantity: number;
    unitCost: number;
    subtotal: number;
};
