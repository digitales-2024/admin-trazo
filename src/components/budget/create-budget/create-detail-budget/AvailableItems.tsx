import { DragCategoriesItem } from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";

import { DraggableItem } from "./DraggableItem";

interface AvailableItemsProps {
    items: DragCategoriesItem[];
}

export const AvailableItems: React.FC<AvailableItemsProps> = ({ items }) => {
    const renderItems = (items: DragCategoriesItem[], depth = 0) => {
        return items.map((item, index) => (
            <React.Fragment key={item.id}>
                <DraggableItem
                    id={item.id}
                    name={item.name}
                    type={item.type ?? "category"}
                    index={index}
                    depth={depth}
                />
                {item.subcategories &&
                    renderItems(item.subcategories, depth + 1)}
                {item.workItems && renderItems(item.workItems, depth + 1)}
                {item.subWorkItems && renderItems(item.subWorkItems, depth + 1)}
            </React.Fragment>
        ));
    };

    return (
        <Droppable droppableId="items">
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-1/3 rounded-md bg-gray-100 p-4"
                >
                    <h3 className="mb-2 font-semibold">
                        Elementos Disponibles
                    </h3>
                    {renderItems(items)}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
