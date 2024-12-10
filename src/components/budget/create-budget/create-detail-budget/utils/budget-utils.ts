import {
    DragCategoriesItem,
    FullCategory,
    SubcategoryDragCategory,
    SubworkItemDragCategory,
    WorkItemDragCategory,
} from "@/types";

export const calculateSubWorkItemTotal = (subItem: SubworkItemDragCategory) =>
    (subItem.quantity || 0) * (subItem.unitCost || 0);

export const calculateWorkItemTotal = (item: WorkItemDragCategory) =>
    item.subWorkItems && item.subWorkItems.length > 0
        ? item.subWorkItems.reduce(
              (total, subItem) => total + calculateSubWorkItemTotal(subItem),
              0,
          )
        : (item.quantity || 0) * (item.unitCost || 0);

export const calculateSubcategoryTotal = (
    subcategory: SubcategoryDragCategory,
) => {
    if (!subcategory.workItems) {
        return 0;
    }
    return subcategory.workItems.reduce(
        (total, item) => total + calculateWorkItemTotal(item),
        0,
    );
};

export const calculateCategoryTotal = (category: FullCategory) =>
    category.subcategories.reduce(
        (total, subcategory) => total + calculateSubcategoryTotal(subcategory),
        0,
    );

export function findDragItemById(
    items: DragCategoriesItem[],
    id: string,
): DragCategoriesItem | undefined {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.subcategories) {
            const found = findDragItemById(item.subcategories, id);
            if (found) return found;
        }
        if (item.workItems) {
            const found = findDragItemById(item.workItems, id);
            if (found) return found;
        }
        if (item.subWorkItems) {
            const found = findDragItemById(item.subWorkItems, id);
            if (found) return found;
        }
    }
    return undefined;
}

export interface DragResult {
    source: {
        droppableId: string;
        index: number;
    };
    destination: {
        droppableId: string;
        index: number;
    } | null;
    draggableId: string;
    type: string;
}
