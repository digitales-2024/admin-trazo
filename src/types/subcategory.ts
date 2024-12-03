export type Subcategory = {
    id: string;
    name: string;
    isActive: boolean;
    category: Category;
};

type Category = {
    id: string;
    name: string;
};
