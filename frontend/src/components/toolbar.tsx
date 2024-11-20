import React from "react";
import { useDnD } from "./DnDContext";

export default function Toolbar() {
  const [_, setType] = useDnD();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="fixed top-10 right-10 bg-gray-800 text-white p-4 rounded-md shadow-lg"
      style={{ width: "200px" }}
    >
      <h2 className="mb-4 text-lg font-semibold">Toolbar</h2>
      <div
        className="p-2 bg-blue-500 rounded-md cursor-pointer text-center mb-4"
        draggable
        onDragStart={(event) => onDragStart(event, "databaseSchema")}
      >
        Schema Blob
      </div>
      <div
        className="p-2 bg-blue-500 rounded-md cursor-pointer text-center mb-4"
        draggable
        onDragStart={(event) => onDragStart(event, "databaseSchema")}
      >
        Schema Blob
      </div>
      <div
        className="p-2 bg-blue-500 rounded-md cursor-pointer text-center mb-4"
        draggable
        onDragStart={(event) => onDragStart(event, "databaseSchema")}
      >
        Schema Blob
      </div>
    </div>
  );
}
