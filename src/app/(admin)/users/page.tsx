"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Usuarios</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona los usuarios con acceso a la aplicación
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardDescription>
                        Todos los usuarios registrados:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="pb-4 text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Crear usuario</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <CreateUser />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Nombre
                                </TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead className="text-right">
                                    Rol
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    INV001
                                </TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">
                                    $250.00
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

const userCreateSchema = z.object({
    name: z.string().min(2)
        .max(50),
    username: z.string().min(2)
        .max(50),
    email: z
        .string()
        .min(1, {
            message: "Ingrese su email",
        })
        .email({
            message: "Email no válido",
        }),
    telephone: z.string().min(6),
    password: z.string().min(1, {
        message: "Ingrese su contraseña",
    }),
    roles: z.array(z.string()),
});
type UserCreateSchema = z.infer<typeof userCreateSchema>;

function CreateUser() {
    const form = useForm<UserCreateSchema>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: "",
            email: "",
            telephone: "",
            password: "",
        },
    });

    function onSubmit(values: UserCreateSchema) {
        console.log(values);
    }

    return (
        <DialogHeader>
            <DialogTitle>Crear un usuario nuevo</DialogTitle>
            <DialogDescription>
                Complete la información y presione el boton Crear.
            </DialogDescription>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ejm: Juan Perez"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="usuario@trazoarq.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ejemplo: 999 888 777"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input placeholder="········" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="rol">Rol</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange([value])
                                    }
                                    defaultValue={field?.value?.[0] ?? ""}
                                >
                                    <FormControl>
                                        <SelectTrigger className="capitalize">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {[{ id: "-1", name: "TODO" }].map((rol) => (
                                                <SelectItem
                                                    key={rol.id}
                                                    value={rol.id}
                                                    className="capitalize"
                                                >
                                                    {rol.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Crear</Button>
                </form>
            </Form>
        </DialogHeader>
    );
}
