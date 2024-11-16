"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const FormSchema = z.object({
    date: z.date({
        required_error: "Date is required!.",
    }),
});

export function DateTimePickerV2() {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast.success(`Meeting on: ${format(data.date, "PPP")}`);
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="flex w-full gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover
                                        open={isOpen}
                                        onOpenChange={setIsOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    {field.value ? (
                                                        `${format(field.value, "PPP")}`
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={date || field.value}
                                                onSelect={(selectedDate) => {
                                                    setDate(selectedDate!);
                                                    field.onChange(
                                                        selectedDate,
                                                    );
                                                }}
                                                onDayClick={() =>
                                                    setIsOpen(false)
                                                }
                                                fromYear={2000}
                                                toYear={new Date().getFullYear()}
                                                disabled={(date) =>
                                                    Number(date) <
                                                        Date.now() -
                                                            1000 *
                                                                60 *
                                                                60 *
                                                                24 ||
                                                    Number(date) >
                                                        Date.now() +
                                                            1000 *
                                                                60 *
                                                                60 *
                                                                24 *
                                                                30
                                                }
                                                defaultMonth={field.value}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Set your date.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
