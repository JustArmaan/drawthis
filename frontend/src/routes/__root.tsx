import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { ReactFlowProvider } from "@xyflow/react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <main className="h-screen flex">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <ReactFlowProvider>
          <div className="flex-1 h-full">
            <Outlet />
          </div>
        </ReactFlowProvider>
      </SidebarProvider>
      <hr />
    </main>
  );
}
