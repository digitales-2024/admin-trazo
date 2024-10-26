import { useSpaces } from "@/hooks/use-space";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Spaces } from "@/types";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";

interface ReactivateSpacesDialogProps
    extends ComponentPropsWithoutRef<typeof AlertDialog> {
    products: Row<Spaces>["original"][];
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export const ReactivateSpacessDialog = ({
    products,
    showTrigger = true,
    onSuccess,
    ...props
}: ReactivateSpacesDialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onReactivateSpaces, isLoadingReactivateSpaces } = useSpaces();

    const onReactivateProductsHandler = () => {
        onReactivateSpaces(products);
        props.onOpenChange?.(false);
        onSuccess?.();
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <RefreshCcwDot
                                className="mr-2 size-4"
                                aria-hidden="true"
                            />
                            Reactivar ({products.length})
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción reactivará a{" "}
                            <span className="font-medium">
                                {" "}
                                {products.length}
                            </span>
                            {products.length === 1 ? " ambiente" : " ambientes"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            aria-label="Reactivate selected rows"
                            onClick={onReactivateProductsHandler}
                            disabled={isLoadingReactivateSpaces}
                        >
                            {isLoadingReactivateSpaces && (
                                <RefreshCcw
                                    className="mr-2 size-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Reactivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }
    return (
        <Drawer {...props}>
            {showTrigger ? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                        <RefreshCcwDot
                            className="mr-2 size-4"
                            aria-hidden="true"
                        />
                        Reactivar ({products.length})
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
                    <DrawerDescription>
                        Esta acción reactivará a
                        <span className="font-medium">{products.length}</span>
                        {products.length === 1 ? " ambiente" : " ambientes"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button
                        aria-label="Reactivate selected rows"
                        onClick={onReactivateProductsHandler}
                        disabled={isLoadingReactivateSpaces}
                    >
                        {isLoadingReactivateSpaces && (
                            <RefreshCcw
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        Reactivar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
