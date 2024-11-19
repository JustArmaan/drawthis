import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: App,
});

function App() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-100">
        <div className="h-full w-full border-2 border-gray-300"></div>
      </div>

      <div className="w-64 bg-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-4">Toolbar</h2>
        <button className="w-full bg-blue-500 text-white py-2 rounded-md mb-2">
          Add Component
        </button>
        <button className="w-full bg-blue-500 text-white py-2 rounded-md">
          Save Schema
        </button>
      </div>
    </div>
  );
}
