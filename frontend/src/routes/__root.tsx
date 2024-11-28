import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';

interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
});

function Root() {
    return (
        <main>
            <SidebarProvider>
                <AppSidebar />
                <SidebarTrigger />
                <ReactFlowProvider>
                    <Outlet />
                </ReactFlowProvider>
            </SidebarProvider>
            <hr />
        </main>
    );
}
