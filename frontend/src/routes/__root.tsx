import { AppSidebar } from "@/components/app-sidebar";
import { DevTools } from "@/components/devtools";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Background, ReactFlowProvider } from "@xyflow/react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // will hit every route with context of MyRouterContext, will have access to that context in the route
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <ReactFlowProvider>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
              }}
            >
              <Background />
            </div>
            {/* <DevTools /> */}
            <Outlet />
          </ReactFlowProvider>
        </main>
      </SidebarProvider>
      <hr />
    </>
  ),
});

// export const Route = createRootRoute({
//   component: () => (
//     <>
//       <SidebarProvider>
//         <AppSidebar />
//         <main>
//           <SidebarTrigger />
//           <Outlet />
//         </main>
//       </SidebarProvider>
//       <hr />
//     </>
//   ),
// })
