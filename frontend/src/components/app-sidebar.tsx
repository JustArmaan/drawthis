import { User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { schemaQueries, userQueryOptions } from "@/lib/api";
import type { Schema } from "@server/sharedTypes";

export function AppSidebar() {
  // const { isPending, error, data } = useQuery(allQrCodeQueryOptions);
  const { data: schemas, isLoading, error } = useQuery(schemaQueries.all());
  const { isPending, data } = useQuery(userQueryOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>User not logged in</div>;

  const { id } = data?.user || {};

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <span>Home</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {schemas?.map((schema) => {
                return (
                  <SidebarMenuItem key={schema.id}>
                    <Link to={`/schemas/${schema.id}`}>
                      <span>{schema.name}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/profile">
              <User />
              <span>Profile</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}

/* {data.qrCodes.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/${item.id}`}>
                      <QrCode />
                      <span>{item.url}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */
