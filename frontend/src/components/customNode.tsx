import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TableNodeData, ColumnData } from "@/types/schema-types";
import { PlusIcon, TrashIcon } from "lucide-react";

const columnTypes = [
  "INT",
  "VARCHAR(255)",
  "TEXT",
  "BOOLEAN",
  "DECIMAL(10,2)",
  "TIMESTAMP",
  "DATE",
  "FLOAT",
];

export function CreateTableDialog({
  onAddTable,
}: {
  onAddTable: (table: TableNodeData) => void;
}) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<ColumnData[]>([
    { name: "id", type: "INT", primaryKey: true },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "VARCHAR(255)" }]);
  };

  const updateColumn = (index: number, updates: Partial<ColumnData>) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], ...updates };
    setColumns(updatedColumns);
  };

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
  };

  const handleCreateTable = () => {
    if (!tableName.trim()) {
      alert("Please enter a table name");
      return;
    }

    const invalidColumns = columns.some((col) => !col.name.trim());
    if (invalidColumns) {
      alert("Please fill in all column names");
      return;
    }

    const newTable: TableNodeData = {
      id: `table-${Date.now()}`,
      label: tableName,
      columns: columns,
    };

    onAddTable(newTable);
    setTableName("");
    setColumns([{ name: "id", type: "INT", primaryKey: true }]);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="bg-gray-200 text-black">Create Custom Table</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create Custom Table</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tableName" className="text-right">
              Table Name
            </Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="col-span-3"
              placeholder="Enter table name"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Columns</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addColumn}
                className="flex items-center"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Column
              </Button>
            </div>

            {columns.map((column, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center gap-4 mb-2"
              >
                <Input
                  placeholder="Column Name"
                  value={column.name}
                  onChange={(e) =>
                    updateColumn(index, { name: e.target.value })
                  }
                  className="col-span-2"
                />

                <Select
                  value={column.type}
                  onValueChange={(value) =>
                    updateColumn(index, { type: value })
                  }
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`primaryKey-${index}`}
                    checked={column.primaryKey || false}
                    onCheckedChange={(checked) =>
                      updateColumn(index, {
                        primaryKey: checked === true,
                      })
                    }
                  />
                  <Label htmlFor={`primaryKey-${index}`}>PK</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`unique-${index}`}
                    checked={column.unique || false}
                    onCheckedChange={(checked) =>
                      updateColumn(index, {
                        unique: checked === true,
                      })
                    }
                  />
                  <Label htmlFor={`unique-${index}`}>Unique</Label>
                </div>

                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColumn(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleCreateTable}>Create Table</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
