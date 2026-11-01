import { api } from "../../api";

export interface Department {
  id: string | number;
  name: string;
  description?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export const departmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "departments",
      providesTags: ["Department"],
    }),
    getDepartmentById: builder.query<Department, string | number>({
      query: (id) => `departments/${id}`,
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<Department, CreateDepartmentDto>({
      query: (body) => ({
        url: "departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation<Department, { id: string | number; data: CreateDepartmentDto }>({
      query: ({ id, data }) => ({
        url: `departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentApi;
