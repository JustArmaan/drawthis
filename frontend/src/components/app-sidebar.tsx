import { User } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Link } from '@tanstack/react-router';

export function AppSidebar() {
    // const { isPending, error, data } = useQuery(allQrCodeQueryOptions);

    // if (isPending) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

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
                            {/* {data.qrCodes.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/${item.id}`}>
                      <QrCode />
                      <span>{item.url}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
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
