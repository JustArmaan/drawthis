import React from "react";
import { NodeProps, Position } from "reactflow";
import { TableNodeData } from "@/types/schema-types";
import { BaseNode } from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";

const TableNode: React.FC<NodeProps<TableNodeData>> = ({
  id,
  data,
  selected,
}) => {
  return (
    <BaseNode className="p-0" selected={selected}>
      <h2 className="rounded-tl-md rounded-tr-md bg-secondary p-2 text-center text-sm text-muted-foreground">
        {data.label}
      </h2>
      <table className="w-full border-spacing-10 overflow-visible">
        <tbody>
          {data.columns.map((column) => (
            <tr key={column.name} className="relative text-xs">
              <td className="pl-0 pr-6 font-light">
                <LabeledHandle
                  id={column.name}
                  title={column.name}
                  type="target"
                  position={Position.Left}
                />
                {column.name}
              </td>

              <td className="px-2 text-right font-thin text-muted-foreground">
                {column.type}
              </td>

              <td className="pr-0 text-right">
                <LabeledHandle
                  id={column.name}
                  title={column.name}
                  type="source"
                  position={Position.Right}
                  className="p-0"
                />
                {column.primaryKey && (
                  <span className="text-blue-600 ml-2">PK</span>
                )}
                {column.unique && (
                  <span className="text-purple-600 ml-2">U</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </BaseNode>
  );
};

TableNode.displayName = "TableNode";

export default TableNode;
