export type ExecutionProject = {
    id: string;
    code: string;
    name: string;
    status: ExecutionProjectStatusType;
    ubicationProject: string;
    province: string;
    department: string;
    startProjectDate: string;
    executionTime: string;
    client: {
        id: string;
        name: string;
    };
    resident: {
        id: string;
        name: string;
    };
    budget: {
        id: string;
        code: string;
    };
};

export enum ExecutionProjectStatusType {
    STARTED = "STARTED",
    CANCELLED = "CANCELLED",
    EXECUTION = "EXECUTION",
    COMPLETED = "COMPLETED",
}
