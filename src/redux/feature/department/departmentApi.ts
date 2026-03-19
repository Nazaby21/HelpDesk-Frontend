import { api } from "../../api";

export interface Department {
  id: string | number;
  name: string;
}

export interface CreateDepartmentDto {
  name: string;
}

export const departmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "departments",
      providesTags: ["Department"],
    }),
    createDepartment: builder.mutation<Department, CreateDepartmentDto>({
      query: (body) => ({
        url: "departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useGetDepartmentsQuery, useCreateDepartmentMutation } = departmentApi;
