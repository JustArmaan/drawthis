import React, { useState, useCallback } from "react";
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
import { TableNodeData } from "@/types/schema-types";
import { EdgeProps } from "@xyflow/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

function TableNode({ data }: { data: TableNodeData }) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-md shadow-lg">
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
  );
}

function OneToOneEdge(props: EdgeProps) {
  return (
    <path
      {...props}
      markerEnd="url(#oneToOneMarker)"
      stroke="blue"
      strokeDasharray="5,5"
    />
  );
}

function OneToManyEdge(props: EdgeProps) {
  return (
    <path
      {...props}
      markerEnd="url(#oneToManyMarker)"
      stroke="green"
      strokeDasharray="3,3"
    />
  );
}

function ManyToManyEdge(props: EdgeProps) {
  return (
    <path
      {...props}
      markerEnd="url(#manyToManyMarker)"
      stroke="red"
      strokeDasharray="2,2"
    />
  );
}

function Index() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes: NodeTypes = {
    table: TableNode,
  };

  const edgeTypes: EdgeTypes = {
    oneToOne: OneToOneEdge,
    oneToMany: OneToManyEdge,
    manyToMany: ManyToManyEdge,
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${uuidv4()}`,
        type: "oneToOne",
        source: connection.source || "",
        target: connection.target || "",
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
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

    console.log(JSON.stringify(schemaJSON, null, 2));
  };

  const predefinedTables = [
    {
      label: "Users",
      columns: [
        { name: "id", type: "int" },
        { name: "username", type: "varchar" },
        { name: "email", type: "varchar" },
      ],
    },
    {
      label: "Products",
      columns: [
        { name: "id", type: "int" },
        { name: "name", type: "varchar" },
        { name: "price", type: "decimal" },
      ],
    },
    {
      label: "Orders",
      columns: [
        { name: "id", type: "int" },
        { name: "user_id", type: "int" },
        { name: "total", type: "decimal" },
      ],
    },
  ];

  return (
    <div className="h-screen">
      <div className="fixed top-4 right-4 z-10 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Add Table</h3>
        {predefinedTables.map((table, index) => (
          <button
            key={index}
            onClick={() => handleAddTable(table)}
            className="block w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {table.label}
          </button>
        ))}
        <button
          onClick={handleSaveSchema}
          className="mt-4 w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Schema
        </button>
      </div>

      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
          <Background />
          <svg>
            <defs>
              <marker
                id="oneToOneMarker"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="blue" />
              </marker>
              <marker
                id="oneToManyMarker"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="green" />
              </marker>
              <marker
                id="manyToManyMarker"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
