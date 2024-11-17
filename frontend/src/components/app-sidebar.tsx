import { QrCode } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { allQrCodeQueryOptions } from "@/query";


export function AppSidebar() {

  const { isPending, error, data } = useQuery(allQrCodeQueryOptions)

  console.log(data)

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>


  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <QrCode />
              <span>QR Codes</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.qrCodes.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/${item.id}`}>
                      <QrCode />
                      <span>{item.url}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
