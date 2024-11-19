export type DesignProjectStatus =
    | "APPROVED"
    | "ENGINEERING"
    | "CONFIRMATION"
    | "PRESENTATION"
    | "COMPLETED";

interface BaseDesignProject {
    id: string;
    code: string;
    name: string;
    status: DesignProjectStatus;
    ubicationProject: string;
    province: string;
    department: string;
    startProjectDate: string;
}

export type DesignProjectSummaryData = BaseDesignProject & {
    client: {
        id: string;
        name: string;
    };
    quotation: {
        id: string;
        publicCode: number;
    };
    designer: {
        id: string;
        name: string;
    };
};

export type DesignProjectCreate = {
    name: string;
    ubicationProject: string;
    province: string;
    department: string;
    clientId: string;
    quotationId: string;
    designerId: string;
    startProjectDate: string;
};
