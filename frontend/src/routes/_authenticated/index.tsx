import Toolbar from '@/components/toolbar';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
});

const GRID_SIZE = 40;
const GRID_COLOR = '#e0e0e0';
const MIN_BLOCK_WIDTH = 200;
const MIN_BLOCK_HEIGHT = 150;

interface TableColumn {
    name: string;
    type: string;
}

interface SchemaTable {
    id: string;
    x: number;
    y: number;
    name: string;
    columns: TableColumn[];
}

function TableItem({
    id,
    x,
    y,
    table,
    onDragStart,
}: {
    id: string;
    x: number;
    y: number;
    table: SchemaTable;
    onDragStart: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className="absolute bg-white border-2 border-gray-300 rounded-md shadow-lg"
            style={{
                left: x,
                top: y,
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'none',
                zIndex: isDragging ? 10 : 1,
                minWidth: `${MIN_BLOCK_WIDTH}px`,
                minHeight: `${MIN_BLOCK_HEIGHT}px`,
                width: 'fit-content',
                height: 'fit-content',
            }}
            {...listeners}
            {...attributes}
            onMouseDown={() => onDragStart(id)}
        >
            <div className="bg-gray-100 p-2 font-bold text-center border-b">{table.name}</div>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="p-2 text-left">Column Name</th>
                        <th className="p-2 text-left">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {table.columns.map((column, index) => (
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

function DropZone({ droppedTables, onDragStart }: { droppedTables: SchemaTable[]; onDragStart: (id: string) => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'drop-zone',
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                minHeight: '100vh',
                backgroundImage: `
                    linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px),
                    linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundColor: isOver ? 'rgba(0,255,0,0.1)' : 'transparent',
                zIndex: 0,
            }}
        >
            {droppedTables.map((table) => (
                <TableItem
                    key={table.id}
                    id={table.id}
                    x={table.x}
                    y={table.y}
                    table={table}
                    onDragStart={onDragStart}
                />
            ))}
        </div>
    );
}

function Index() {
    const [droppedTables, setDroppedTables] = useState<SchemaTable[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (over && over.id === 'drop-zone') {
            const activeRect = active.rect.current.translated;

            if (activeRect) {
                const x = Math.round(activeRect.left / GRID_SIZE) * GRID_SIZE;
                const y = Math.round(activeRect.top / GRID_SIZE) * GRID_SIZE;

                // Check if this is a new table or moving an existing one
                const existingTableIndex = droppedTables.findIndex((table) => table.id === active.id);

                if (existingTableIndex !== -1) {
                    // Update existing table position
                    const updatedTables = [...droppedTables];
                    updatedTables[existingTableIndex] = {
                        ...updatedTables[existingTableIndex],
                        x,
                        y,
                    };
                    setDroppedTables(updatedTables);
                } else {
                    // Add new table
                    const newTable: SchemaTable = {
                        id: uuidv4(),
                        name: `Table ${droppedTables.length + 1}`,
                        x,
                        y,
                        columns: [
                            { name: 'id', type: 'int' },
                            { name: 'name', type: 'varchar' },
                        ],
                    };
                    setDroppedTables([...droppedTables, newTable]);
                }
            }
        }
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Toolbar />
            <DropZone droppedTables={droppedTables} onDragStart={(id) => setActiveId(id)} />
            <DragOverlay>
                {activeId ? (
                    <div className="bg-white border-2 border-gray-400 rounded-md shadow-xl">
                        {droppedTables.find((table) => table.id === activeId)?.name || activeId}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Index;
