import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { type Schema, TableCreate, Table } from "@server/sharedTypes";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const schemaQueries = {
  all: () => ({
    queryKey: ["schemas"],
    queryFn: async () => {
      try {
        const res = await client.api.schemas.$get();
        if (!res.ok) {
          throw new Error("Failed to fetch schemas");
        }
        const data = await res.json();
        return data.schemas;
      } catch (error) {
        console.error("Error fetching schemas:", error);
        throw error;
      }
    },
  }),

  create: () => ({
    mutationFn: async (data: Schema) => {
      try {
        const userId = (await getCurrentUser()).user.id;
        if (!userId) {
          throw new Error("User is not authenticated");
        }
        const schemaWithUserId = { ...data, userId };
        const res = await client.api.schemas.$post({ json: schemaWithUserId });
        if (!res.ok) {
          throw new Error("Failed to create schema");
        }
        return res.json();
      } catch (error) {
        console.error("Error creating schema:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemas"] });
    },
  }),
};

export const tableQueries = {
  bySchema: (schemaId: number) => ({
    queryKey: ["tables", schemaId],
    queryFn: async () => {
      try {
        const res = await client.api.tables.$get({
          query: { schemaId: String(schemaId) },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch tables");
        }
        return res.json();
      } catch (error) {
        console.error(`Error fetching tables for schema ${schemaId}:`, error);
        throw error;
      }
    },
  }),

  create: () => ({
    mutationFn: async (data: TableCreate) => {
      try {
        const userId = (await getCurrentUser()).user.id;
        if (!userId) {
          throw new Error("User is not authenticated");
        }
        const tableWithUserId = { ...data, userId };
        const res = await client.api.tables.$post({
          json: tableWithUserId,
        });
        if (!res.ok) {
          throw new Error("Failed to create table");
        }
        return res.json();
      } catch (error) {
        console.error("Error creating table:", error);
        throw error;
      }
    },
    onSuccess: (newTable: Table) => {
      queryClient.invalidateQueries({
        queryKey: ["tables", newTable.schemaId],
      });
    },
  }),

  update: () => ({
    mutationFn: async ({ id, ...data }: TableCreate & { id: number }) => {
      try {
        const userId = (await getCurrentUser()).user.id;
        if (!userId) {
          throw new Error("User is not authenticated");
        }
        const tableWithUserId = { ...data, userId };

        const res = await client.api.tables[":id"].$put({
          param: { id: String(id) },
          json: tableWithUserId,
        });
        if (!res.ok) {
          throw new Error("Failed to update table");
        }
        return res.json();
      } catch (error) {
        console.error(`Error updating table with ID ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (updatedTable: Table) => {
      queryClient.invalidateQueries({
        queryKey: ["tables", updatedTable.schemaId],
      });
    },
  }),

  delete: () => ({
    mutationFn: async (id: number) => {
      try {
        const res = await client.api.tables[":id"].$delete({
          param: { id: String(id) },
        });
        if (!res.ok) {
          throw new Error("Failed to delete table");
        }
        return res.json();
      } catch (error) {
        console.error(`Error deleting table with ID ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (deletedTable: Table) => {
      queryClient.invalidateQueries({
        queryKey: ["tables", deletedTable.schemaId],
      });
    },
  }),
};
