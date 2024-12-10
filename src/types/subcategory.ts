export type Subcategory = {
    id: string;
    name: string;
    isActive: boolean;
    category: Category;
};

export type SubcategoryCreate = {
    name: string,
    categoryId: string,
}

type Category = {
    id: string;
    name: string;
};
