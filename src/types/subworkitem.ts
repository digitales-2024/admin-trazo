import { ApuCreate } from "./apu";

export type SubWorkItemCreate = {
    subcategoryId: string;
    name: string;
    unit: string;
    apu: ApuCreate;
};

export type WorkItemGetSubItem = {
    name: string;
    id: string;
    unit: string;
    unitCost: number;
};
