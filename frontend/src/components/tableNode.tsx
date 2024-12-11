import React from "react";
import { NodeProps, Position, Handle } from "reactflow";
import { TableNodeData } from "@/types/schema-types";

const TableNode: React.FC<NodeProps<TableNodeData>> = ({
  id,
  data,
  selected,
}) => {
  return (
    <div
      className={`border ${selected ? "border-blue-500" : "border-gray-300"}`}
    >
      <h2 className="bg-secondary p-2 text-center text-sm text-muted-foreground">
        {data.label}
      </h2>
      <table className="w-full">
        <tbody>
          {data.columns.map((column) => (
            <tr key={column.name} className="relative">
              <Handle
                type="target"
                position={Position.Left}
                id={`${id}-${column.name}-target`}
                style={{ top: "auto", bottom: "auto" }}
              />

              <td>{column.name}</td>
              <td>{column.type}</td>
              <Handle
                type="source"
                position={Position.Right}
                id={`${id}-${column.name}-source`}
                style={{ top: "auto", bottom: "auto" }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableNode;
