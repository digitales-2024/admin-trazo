import { DragCategoriesItem } from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import { ChevronRight, ChevronDown } from "lucide-react";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DraggableItem } from "./DraggableItem";

interface AvailableItemsProps {
    items: DragCategoriesItem[];
}

export const AvailableItems: React.FC<AvailableItemsProps> = ({ items }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const itemMatchesSearch = (
        item: DragCategoriesItem,
        term: string,
    ): boolean => {
        if (item.name.toLowerCase().includes(term.toLowerCase())) return true;
        if (item.subcategories?.some((sub) => itemMatchesSearch(sub, term)))
            return true;
        if (item.workItems?.some((i) => itemMatchesSearch(i, term)))
            return true;
        if (item.subWorkItems?.some((sub) => itemMatchesSearch(sub, term)))
            return true;
        return false;
    };

    const renderItems = (items: DragCategoriesItem[], depth = 0) => {
        return items
            .filter(
                (item) =>
                    searchTerm === "" || itemMatchesSearch(item, searchTerm),
            )
            .map((item, index) => (
                <React.Fragment key={item.id}>
                    <div
                        className={`flex items-center space-x-2 p-1 transition-colors duration-150 ease-in-out hover:bg-gray-100`}
                        style={{ paddingLeft: `${depth * 1.5}rem` }}
                    >
                        {((item.subcategories?.length ?? 0) > 0 ||
                            (item.workItems?.length ?? 0) > 0 ||
                            (item.subWorkItems?.length ?? 0) > 0) && (
                            <button
                                type="button"
                                onClick={() => toggleExpand(item.id)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {expandedItems.has(item.id) ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        )}
                        <DraggableItem
                            id={item.id}
                            name={item.name}
                            type={item.type ?? "category"}
                            index={index}
                            depth={depth}
                        />
                    </div>
                    {expandedItems.has(item.id) && (
                        <>
                            {item.subcategories &&
                                renderItems(item.subcategories, depth + 1)}
                            {item.workItems &&
                                renderItems(item.workItems, depth + 1)}
                            {item.subWorkItems &&
                                renderItems(item.subWorkItems, depth + 1)}
                        </>
                    )}
                </React.Fragment>
            ));
    };

    return (
        <Droppable droppableId="items">
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-full rounded-md border border-gray-200 bg-white p-4 md:w-1/3"
                >
                    <h3 className="mb-2 font-semibold">
                        Elementos Disponibles
                    </h3>
                    <Input
                        type="text"
                        placeholder="Buscar elementos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                    />
                    <ScrollArea className="h-[400px] pr-4">
                        {renderItems(items)}
                        {provided.placeholder}
                    </ScrollArea>
                </div>
            )}
        </Droppable>
    );
};
