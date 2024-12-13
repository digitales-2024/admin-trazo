import { ApuCreate } from "./apu";

export type SubWorkItemCreate = {
    parentId: string;
    name: string;
    unit: string;
    apu: ApuCreate;
};

export type SubWorkItemEdit = {
    name?: string;
    unit?: string;
    unitCost?: number;
};

export type WorkItemGetSubItem = {
    name: string;
    id: string;
    unit: string;
    unitCost: number;
};
