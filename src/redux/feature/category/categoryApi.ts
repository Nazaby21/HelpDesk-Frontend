import { api } from "../../api";

export interface Category {
  id: string | number;
  name: string;
  description?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoryApi;
