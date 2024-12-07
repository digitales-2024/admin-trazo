export type ApuCreate = {
    performance: number;
    workHours: number;
    resources: Array<ApuCreateResource>;
};

export type ApuCreateResource = {
    resourceId: string;
    quantity: number;
    group?: number;
};

type Apu = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    unitCost: number;
    performance: number;
    workHours: number;
};

type ApuOnResource = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    apuId: string;
    quantity: number;
    subtotal: number;
    group: number | null;
    resourceId: string;
};

type Resource = {
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    unit: string;
    unitCost: number;
    type: "TOOLS" | "LABOR" | "SUPPLIES" | "SERVICES";
};

type ApuResourceReturn = Pick<ApuOnResource, "id" | "group" | "quantity"> & {
    resource: Pick<Resource, "id" | "name" | "unitCost" | "type" | "unit">;
};

export type ApuReturnNested = Apu & {
    apuResource: Array<ApuResourceReturn>;
};
