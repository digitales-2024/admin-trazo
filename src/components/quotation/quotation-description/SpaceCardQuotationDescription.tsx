import { SpaceQuotation } from "@/types";
import { Home, Maximize2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SpaceCardQuotationDescription({
    space,
    level,
}: {
    space: SpaceQuotation;
    level: string;
    index: number;
}) {
    return (
        <div>
            <Card
                style={{ backgroundColor: "#fff", borderColor: "#000000" }}
                className="overflow-hidden border-2"
            >
                <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{space.name}</h3>
                        <Badge variant="outline" className="border-[#be2126]">
                            {level}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Maximize2 size={16} className="mr-2" />
                            <span className="text-2xl font-bold">
                                {space.area}
                            </span>
                            <span className="ml-1 text-sm">m²</span>
                        </div>
                        <div className="flex items-center">
                            <Home size={16} className="mr-2" />
                            <span>{space.amount}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}