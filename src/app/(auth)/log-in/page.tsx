"use client";

import ImagePlaceholder from "@/assets/images/placeholder.webp";
import Image from "next/image";

import { FormLogin } from "@/components/log-in/FormLogin";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

export default function LogIn() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center">
            <Image
                src={ImagePlaceholder}
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="z-0"
            />
            <div className="absolute inset-0 z-10 bg-black opacity-50"></div>
            <Card
                className={cn(
                    "z-20 w-[30rem] bg-white bg-opacity-90 backdrop-blur-md",
                )}
            >
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Inicia sesión
                    </CardTitle>
                    <CardDescription>
                        Inicia sesión para acceder al sistema de Trazo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormLogin />
                </CardContent>
            </Card>
        </div>
    );
}
