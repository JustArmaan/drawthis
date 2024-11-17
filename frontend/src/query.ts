import { QueryClient, queryOptions } from "@tanstack/react-query";
import { type ApiRoutes } from "@server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const queryClient = new QueryClient();

type QrCode = {
  id: string;
  url: string;
  // style
};

async function fetchAllQrCodes() {
  // const response = await fetch("/api/qr")
  const response = await client.api.qr.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch qr codes");
  }
  return await response.json();
}

export const allQrCodeQueryOptions = queryOptions({
  queryKey: ["all-qr-codes"],
  queryFn: async () => await fetchAllQrCodes(),
  staleTime: Infinity,
});
