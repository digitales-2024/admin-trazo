import { ResourceType } from "./resource";

export type ApuBudget = {
    id: string;
    unitCost: number;
    workHours: number;
    performance: number;
    apuResource: ApuResourceBudget[];
};
type ApuResourceBudget = {
    id: string;
    group: number;
    quantity: number;
    resource: ResourceApuBudget;
};

type ResourceApuBudget = {
    id: string;
    type: ResourceType;
    name: string;
    unit: string;
    unitCost: number;
};
