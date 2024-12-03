import { FullCategory } from "@/types";

export interface SubWorkItemType {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface WorkItemType {
    id: string;
    name: string;
    subItems: SubWorkItemType[];
    quantity?: number;
    unitPrice?: number;
}

export interface SubcategoryType {
    id: string;
    name: string;
    items: WorkItemType[];
}

export interface CategoryType {
    id: string;
    name: string;
    subcategories: SubcategoryType[];
}

export interface Budget {
    categories: FullCategory[];
    overheadPercentage: number;
    profitPercentage: number;
    taxPercentage: number;
}
