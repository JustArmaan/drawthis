import React, { useState, useEffect } from "react";
import { NodeProps } from "reactflow";
import { TableNodeData, ColumnData } from "@/types/schema-types";

function TableNode({ data, id }: NodeProps<TableNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<TableNodeData>({ ...data });

  useEffect(() => {
    setEditedData({ ...data });
  }, [data]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      label: e.target.value,
    }));
  };

  const handleColumnChange = (
    index: number,
    field: keyof ColumnData,
    value: string
  ) => {
    const newColumns = [...editedData.columns];
    newColumns[index] = {
      ...newColumns[index],
      [field]: value,
    };

    setEditedData((prev) => ({
      ...prev,
      columns: newColumns,
    }));
  };

  const handleAddColumn = () => {
    const newColumns = [
      ...editedData.columns,
      { name: "new_column", type: "VARCHAR(255)" },
    ];

    setEditedData((prev) => ({
      ...prev,
      columns: newColumns,
    }));
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = editedData.columns.filter((_, i) => i !== index);
    setEditedData((prev) => ({
      ...prev,
      columns: newColumns,
    }));
  };

  const handleSave = () => {
    //save changes bro
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-300 rounded-md shadow-lg w-64">
        <div className="bg-blue-100 p-2">
          <input
            type="text"
            value={editedData.label}
            onChange={handleLabelChange}
            className="w-full font-bold text-center bg-blue-100"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Column Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {editedData.columns.map((column, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) =>
                      handleColumnChange(index, "name", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={column.type}
                    onChange={(e) =>
                      handleColumnChange(index, "type", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleRemoveColumn(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between p-2">
          <button
            onClick={handleAddColumn}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Add Column
          </button>
          <div>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-white border-2 border-gray-300 rounded-md shadow-lg cursor-pointer w-64"
        onDoubleClick={() => setIsEditing(true)}
      >
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
      <div className="text-xs text-gray-500 text-center mt-1">
        Double-click to edit
      </div>
    </>
  );
}

export default TableNode;
