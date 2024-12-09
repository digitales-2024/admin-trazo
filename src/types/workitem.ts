import { ApuCreate } from "./apu";
import { Resource } from "./resource";

export type WorkItemCreate = {
    subcategoryId: string;
    name: string;
    unit?: string;
    apu?: ApuCreate;
};

export type WorkItemEdit = {
    name?: string;
    unit?: string;
};

export type WorkItemGetAll = {
    name: string;
    id: string;
    unit?: string;
    unitCost?: number;
    apuId?: string;
    subWorkItem?: Array<WorkItemGetSubItem>;
};

export type WorkItemGetSubItem = {
    name: string;
    id: string;
    unit: string;
    unitCost: number;
};

export type FullWorkItem = {
    id: string;
    name: string;
    unit: string;
    unitCost: number;
    apu: ApuFullWorkItem;
};

export type ApuFullWorkItem = {
    id: string;
    unitCost: number;
    performance: number;
    workHours: number;
    apuOnResource: ApuOnResourceFullWorkItem[];
};

export type ApuOnResourceFullWorkItem = {
    id: string;
    quantity: number;
    subtotal: number;
    group?: number;
    resource: Resource;
};

export type ResourceExpandedApu = {
    name: string;
    icon: React.ElementType;
    color: string;
};
