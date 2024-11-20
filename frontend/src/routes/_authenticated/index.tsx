import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Background, ReactFlowProvider, ReactFlow } from "@xyflow/react";

export const Route = createFileRoute("/_authenticated/")({
  component: App,
});

function App() {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <Background />
      </ReactFlowProvider>
    </div>
  );
}
