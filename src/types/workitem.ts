import { ApuCreate } from "./apu";

export type WorkItemCreate = {
    name: string;
    unit?: string;
    apu?: ApuCreate;
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
