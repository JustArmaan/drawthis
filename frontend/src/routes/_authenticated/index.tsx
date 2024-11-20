import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Background, ReactFlowProvider, ReactFlow } from "@xyflow/react";
import Toolbar from "@/components/toolbar";

export const Route = createFileRoute("/_authenticated/")({
  component: App,
});

function App() {
  return (
    <div className=" w-full">
      <Toolbar />
    </div>
  );
}
