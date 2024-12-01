import Toolbar from '@/components/toolbar';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { Background } from '@xyflow/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
});

const GRID_SIZE = 20;

function DraggableItem({
    id,
    x,
    y,
    onDragStart,
}: {
    id: string;
    x: number;
    y: number;
    onDragStart: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className="absolute bg-green-200 p-2 rounded-md cursor-move"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : 'translate(-10%, -10%)',
                zIndex: isDragging ? 10 : 1,
            }}
            {...listeners}
            {...attributes}
            onMouseDown={() => onDragStart(id)}
        >
            {id}
        </div>
    );
}

function DropZone({
    droppedItems,
    onDragStart,
}: {
    droppedItems: Array<{ id: string; x: number; y: number }>;
    onDragStart: (id: string) => void;
}) {
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
                backgroundColor: isOver ? 'rgba(0,255,0,0.1)' : 'transparent',
                zIndex: 0,
            }}
        >
            <Background />
            {droppedItems.map((item) => (
                <DraggableItem key={item.id} id={item.id} x={item.x} y={item.y} onDragStart={onDragStart} />
            ))}
        </div>
    );
}

function Index() {
    const [droppedItems, setDroppedItems] = useState<Array<{ id: string; x: number; y: number }>>([]);
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
                const newId = uuidv4();

                const x = Math.round(activeRect.left / GRID_SIZE) * GRID_SIZE;
                const y = Math.round(activeRect.top / GRID_SIZE) * GRID_SIZE;

                const updatedItems = droppedItems.map((item) =>
                    item.id === active.id
                        ? {
                              ...item,
                              x: x,
                              y: y,
                          }
                        : item
                );

                const isNewItem = !droppedItems.some((item) => item.id === active.id);
                if (isNewItem) {
                    updatedItems.push({
                        id: newId,
                        x: x,
                        y: y,
                    });
                }

                setDroppedItems(updatedItems);
            }
        }
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Toolbar />
            <DropZone droppedItems={droppedItems} onDragStart={(id) => setActiveId(id)} />
            <DragOverlay>
                {activeId ? <div className="absolute bg-green-300 p-2 rounded-md cursor-move">{activeId}</div> : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Index;
