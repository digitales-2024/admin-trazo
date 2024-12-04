import { ResourceType } from "./resource";

export type ApuBudget = {
    id: string;
    unitCost: string;
    workHours: string;
    performance: number;
    apuResource: ApuResourceBudget[];
};
type ApuResourceBudget = {
    id: string;
    group: string;
    quantity: string;
    resource: ResourceApuBudget;
};

type ResourceApuBudget = {
    id: string;
    type: ResourceType;
    name: string;
    unit: string;
    unitCost: number;
};
