import Toolbar from '@/components/toolbar';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { Background } from '@xyflow/react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
});

function DropZone({
    droppedItems,
    onDropItem,
}: {
    droppedItems: Array<{ id: string; x: number; y: number }>;
    onDropItem: (event: DragEndEvent) => void;
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
                <div
                    key={item.id}
                    className="absolute bg-green-200 p-2 rounded-md"
                    style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {item.id}
                </div>
            ))}
        </div>
    );
}

function Index() {
    const [droppedItems, setDroppedItems] = useState<Array<{ id: string; x: number; y: number }>>([]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // Check if dropped on the drop zone
        if (over && over.id === 'drop-zone') {
            // Get the coordinates from the active item's rect
            const activeRect = active.rect.current.translated;

            if (activeRect) {
                const newItem = {
                    id: active.id as string,
                    x: activeRect.left,
                    y: activeRect.top,
                };

                // Add the item to the list
                setDroppedItems((currentItems) => [...currentItems, newItem]);
            }
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Toolbar />
            <DropZone droppedItems={droppedItems} onDropItem={handleDragEnd} />
        </DndContext>
    );
}

export default Index;
