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
                return (
                    <Package
                        className="h-4 w-4 text-blue-500"
                        strokeWidth={1.5}
                    />
                );
            case "subcategory":
                return (
                    <Layers
                        className="h-4 w-4 text-green-500"
                        strokeWidth={1.5}
                    />
                );
            case "workItem":
                return (
                    <FileText
                        className="h-4 w-4 text-yellow-500"
                        strokeWidth={1.5}
                    />
                );
            case "subWorkItem":
                return (
                    <List className="h-4 w-4 text-red-500" strokeWidth={1.5} />
                );
        }
    };
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center space-x-2 p-2 capitalize ml-${depth * 4}`}
                >
                    {getIcon()}
                    <span className="text-sm font-light">{name}</span>
                </div>
            )}
        </Draggable>
    );
};
