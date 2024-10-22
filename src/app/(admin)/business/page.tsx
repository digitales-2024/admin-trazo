import { Card, CardContent } from "@/components/ui/card";

export default function BusinessPage() {
    return (
        <div>
            <div className="pb-8 pt-16">
                <h2 className="pb-2 text-4xl font-black">Business</h2>
                <p className="text-sm text-muted-foreground">
                    Gestiona la información del negocio
                </p>
            </div>

            <Card className="pt-6">
                <CardContent>Contenido de Business</CardContent>
            </Card>
        </div>
    );
}
