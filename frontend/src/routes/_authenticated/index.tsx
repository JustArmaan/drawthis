import Toolbar from '@/components/toolbar';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
});

const GRID_SIZE = 40; // Base grid size
const GRID_COLOR = '#e0e0e0'; // Light gray grid color
const MIN_BLOCK_WIDTH = 120; // Minimum block width
const MIN_BLOCK_HEIGHT = 60; // Minimum block height

function DraggableItem({
    id,
    x,
    y,
    content,
    onDragStart,
}: {
    id: string;
    x: number;
    y: number;
    content?: string;
    onDragStart: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className="absolute bg-green-200 p-4 rounded-md cursor-move flex items-center justify-center"
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
            <span className="text-center break-words max-w-full">{content || id}</span>
        </div>
    );
}

function DropZone({
    droppedItems,
    onDragStart,
}: {
    droppedItems: Array<{ id: string; x: number; y: number; content?: string }>;
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
                backgroundImage: `
                    linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px),
                    linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundColor: isOver ? 'rgba(0,255,0,0.1)' : 'transparent',
                zIndex: 0,
            }}
        >
            {droppedItems.map((item) => (
                <DraggableItem
                    key={item.id}
                    id={item.id}
                    x={item.x}
                    y={item.y}
                    content={item.content}
                    onDragStart={onDragStart}
                />
            ))}
        </div>
    );
}

function Index() {
    const [droppedItems, setDroppedItems] = useState<
        Array<{
            id: string;
            x: number;
            y: number;
            content?: string;
        }>
    >([]);
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

                const updatedItems = [...droppedItems];
                const existingItemIndex = updatedItems.findIndex((item) => item.id === active.id);

                if (existingItemIndex !== -1) {
                    // Update existing item
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        x,
                        y,
                    };
                } else {
                    // Add new item with dynamic content
                    updatedItems.push({
                        id: uuidv4(),
                        x,
                        y,
                        content: `Item ${updatedItems.length + 1}`,
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
                {activeId ? (
                    <div
                        className="absolute bg-green-300 p-4 rounded-md cursor-move flex items-center justify-center"
                        style={{
                            minWidth: `${MIN_BLOCK_WIDTH}px`,
                            minHeight: `${MIN_BLOCK_HEIGHT}px`,
                            width: 'fit-content',
                            height: 'fit-content',
                        }}
                    >
                        {droppedItems.find((item) => item.id === activeId)?.content || activeId}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Index;
