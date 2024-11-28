"use client";

import { createBudgetSchema, CreateBudgetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "../../ui/form";
import { HeadBudget } from "./create-head-budget/HeadBudget";

export default function CreateBudget() {
    const form = useForm<CreateBudgetSchema>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: {
            name: "",
            ubication: "",
            clientId: "",
            dateProject: "",
            isExistingDesignProject: false,
            designProjectId: "",
        },
    });

    const onSubmit = () => {};

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-1"
                >
                    <HeadBudget form={form} />
                </form>
            </Form>
        </>
    );
}
