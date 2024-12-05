import { useState, useCallback } from "react";
import { DndContext } from "@dnd-kit/core";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "@/components/toolbar";
import { TableNodeData } from "@/types/schema-types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

function TableNode({ data }: { data: TableNodeData }) {
  return (
    <>
      <div className="bg-white border-2 border-gray-300 rounded-md shadow-lg cursor-pointer w-64">
        <div className="bg-gray-100 p-2 font-bold text-center border-b">
          {data.label}
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Column Name</th>
              <th className="p-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.columns.map((column, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{column.name}</td>
                <td className="p-2">{column.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Index() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEdgeType] = useState();

  const nodeTypes: NodeTypes = {
    table: TableNode,
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${uuidv4()}`,
        type: selectedEdgeType,
        source: connection.source || "",
        target: connection.target || "",
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, selectedEdgeType]
  );

  const handleAddTable = (tableData: TableNodeData) => {
    const newNode = {
      id: `node-${uuidv4()}`,
      type: "table",
      position: {
        x: Math.random() * window.innerWidth * 0.7,
        y: Math.random() * window.innerHeight * 0.7,
      },
      data: tableData,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSaveSchema = () => {
    // might use
    const schemaJSON = {
      nodes: nodes.map((node) => ({
        id: node.id,
        label: node.data.label,
        columns: node.data.columns,
        position: node.position,
      })),
      relationships: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
    };
  };

  return (
    <div className="h-screen">
      <DndContext
        onDragEnd={(event) => {
          const { active } = event;
          const tableData = active.data.current as TableNodeData;

          if (tableData) {
            const newNode = {
              id: `node-${uuidv4()}`,
              type: "table",
              position: {
                x: event.delta.x || Math.random() * window.innerWidth * 0.7,
                y: event.delta.y || Math.random() * window.innerHeight * 0.7,
              },
              data: tableData,
            };
            setNodes((nds) => [...nds, newNode]);
          }
        }}
      >
        <Toolbar onAddTable={handleAddTable} />
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </DndContext>
    </div>
  );
}

export default Index;
