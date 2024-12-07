import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TableNodeData, ColumnData } from "@/types/schema-types";
import { CreateTableDialog } from "./customNode";

const DEFAULT_TABLES: TableNodeData[] = [
  {
    id: "table-1",
    label: "Basic Table",
    columns: [
      { name: "id", type: "INT", primaryKey: true },
      { name: "name", type: "VARCHAR(255)" },
    ],
  },
  {
    id: "table-2",
    label: "User Table",
    columns: [
      { name: "user_id", type: "INT", primaryKey: true },
      { name: "username", type: "VARCHAR(50)", unique: true },
      { name: "email", type: "VARCHAR(100)", unique: true },
      {
        name: "created_at",
        type: "TIMESTAMP",
        defaultValue: "CURRENT_TIMESTAMP",
      },
    ],
  },
  {
    id: "table-3",
    label: "Product Table",
    columns: [
      { name: "product_id", type: "INT", primaryKey: true },
      { name: "product_name", type: "VARCHAR(100)" },
      { name: "price", type: "DECIMAL(10,2)" },
      { name: "stock", type: "INT" },
    ],
  },
];

function DraggableItem({ table }: { table: TableNodeData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: table.id,
      data: table,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      className="p-2 bg-blue-500 text-white rounded-md cursor-pointer mb-2 hover:bg-blue-600 transition"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {table.label}
    </div>
  );
}

export default function Toolbar({
  onAddTable,
}: {
  onAddTable: (table: TableNodeData) => void;
}) {
  const [tables, setTables] = useState(DEFAULT_TABLES);

  const handleAddNewTable = (newTable: TableNodeData) => {
    setTables([...tables, newTable]);
    onAddTable(newTable);
  };

  return (
    <div className="fixed top-10 right-10 bg-gray-800 text-white p-4 rounded-md shadow-lg z-10">
      <h2 className="mb-4 text-lg font-semibold">Schema Tables</h2>

      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Templates</h3>
        {tables.map((table) => (
          <DraggableItem key={table.id} table={table} />
        ))}
      </div>

      <div className="mt-4">
        <CreateTableDialog onAddTable={handleAddNewTable} />
      </div>
    </div>
  );
}
