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
  EdgeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "@/components/toolbar";
import { TableNodeData } from "@/types/schema-types";
import { createFileRoute } from "@tanstack/react-router";
import TableNode from "@/components/tableNode";
import CustomEdge from "@/components/customEdge";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

const nodeTypes: NodeTypes = {
  table: TableNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

function Index() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEdgeType] = useState("custom");

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${uuidv4()}`,
        type: "custom",
        source: connection.source || "",
        target: connection.target || "",
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleAddTable = (tableData: TableNodeData) => {
    const newNode = {
      id: `${uuidv4()}`,
      type: "table",
      position: {
        x: Math.random() * window.innerWidth * 0.7,
        y: Math.random() * window.innerHeight * 0.7,
      },
      data: tableData,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const save = async () => {
    const dataToSave = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        type: edge.type,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        data: edge.data || {},
      })),
    };

    console.log(nodes, edges, dataToSave);
    try {
      const response = await fetch("/api/saveSchema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Failed to save schema");
      }
      console.log("Schema saved successfully!");
    } catch (error) {
      console.error("Error saving schema:", error);
    }
  };

  return (
    <div className="h-screen">
      <DndContext
        onDragEnd={(event) => {
          const { active } = event;
          const tableData = active.data.current as TableNodeData;

          if (tableData) {
            const newNode = {
              id: `${uuidv4()}`,
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
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            snapToGrid={true}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </DndContext>

      <button
        onClick={save}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md shadow-md"
      >
        Save
      </button>
    </div>
  );
}

export default Index;
