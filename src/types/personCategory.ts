export type PersonCategoryItem = {
  categoryId: string;
  name: string;
  createdAt?: string;
};

export type MyPersonCategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: PersonCategoryItem[];
};
