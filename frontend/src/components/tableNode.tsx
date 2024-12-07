import React, { memo } from "react";
import { NodeProps } from "reactflow";
import { TableNodeData } from "@/types/schema-types";

const TableNode = memo(({ data }: NodeProps<TableNodeData>) => {
  return (
    <div className="bg-white border-2 border-blue-500 rounded-md shadow-lg w-64 overflow-hidden">
      <div className="bg-blue-500 text-white p-2 font-bold text-center">
        {data.label}
      </div>
      <div className="p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left">Column</th>
              <th className="text-left">Type</th>
              <th className="text-center">Constraints</th>
            </tr>
          </thead>
          <tbody>
            {data.columns.map((column, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td>{column.name}</td>
                <td>{column.type}</td>
                <td className="text-center">
                  {column.primaryKey && (
                    <span className="text-blue-600">PK</span>
                  )}
                  {column.unique && <span className="text-purple-600">U</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TableNode.displayName = "TableNode";

export default TableNode;
