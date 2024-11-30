import { Draggable } from "@hello-pangea/dnd";
import { Package, Layers, FileText, List } from "lucide-react";
import React from "react";

interface DraggableItemProps {
    id: string;
    name: string;
    type: "category" | "subcategory" | "workItem" | "subWorkItem";
    index: number;
    depth?: number;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
    id,
    name,
    type,
    index,
    depth = 0,
}) => {
    const getIcon = () => {
        switch (type) {
            case "category":
                return <Package className="h-5 w-5 text-blue-500" />;
            case "subcategory":
                return <Layers className="h-5 w-5 text-green-500" />;
            case "workItem":
                return <FileText className="h-5 w-5 text-yellow-500" />;
            case "subWorkItem":
                return <List className="h-5 w-5 text-red-500" />;
        }
    };

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center space-x-2 rounded-md border bg-white p-2 shadow-sm ml-${depth * 4}`}
                >
                    {getIcon()}
                    <span>{name}</span>
                </div>
            )}
        </Draggable>
    );
};
