import { ApuCreate } from "./apu";

export type WorkItemCreate = {
    name: string;
    unit?: string;
    apu?: ApuCreate;
};
