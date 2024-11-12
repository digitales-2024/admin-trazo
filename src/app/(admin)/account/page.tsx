"use client";

import { AccountComponent } from "@/components/account/accountUpdate";
import { PasswordComponent } from "@/components/account/passwordUpdate";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Account() {
    return (
        <div>
            <div className="pb-8 pt-16">
                <HeaderPage
                    title="Mi cuenta"
                    description="Configura la información de tu cuenta"
                />
            </div>

            <div className="flex justify-center">
                <Tabs defaultValue="account" className="w-[600px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Cuenta</TabsTrigger>
                        <TabsTrigger value="password">Contraseña</TabsTrigger>
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
    );
}
