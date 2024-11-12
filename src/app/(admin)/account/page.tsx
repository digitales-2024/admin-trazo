"use client";

import { AccountComponent } from "@/components/account/accountUpdate";
import { PasswordComponent } from "@/components/account/passwordUpdate";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";

import apartmentImg from "@/assets/images/departamento.webp";
import { useProfile } from "@/hooks/use-profile";

export default function Account() {
    const { user } = useProfile();
    const userName = user?.name ?? "";
    const initials = userName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("");

    return (
        <Shell className="gap-2">
            <HeaderPage
                title="Mi cuenta"
                description="Configura la información de tu cuenta"
            />

            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <div className="group relative hidden px-4 py-12 lg:block">
                        <Image
                            className="rounded-md brightness-75 transition-all group-hover:brightness-50"
                            src={apartmentImg}
                            alt="Perfil"
                        />
                        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-4xl font-black uppercase tracking-widest text-white">
                            {initials}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Tabs
                        defaultValue="account"
                        className="w-full md:w-[500px]"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Cuenta</TabsTrigger>
                            <TabsTrigger value="password">
                                Contraseña
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <AccountComponent />
                        </TabsContent>

                        <TabsContent value="password">
                            <PasswordComponent />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Shell>
    );
}
