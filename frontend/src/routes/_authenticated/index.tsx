import Toolbar from '@/components/toolbar';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { createFileRoute } from '@tanstack/react-router';
import { Background } from '@xyflow/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
});

function DraggableItem({ id, x, y, isToolbarItem }: { id: string; x: number; y: number; isToolbarItem?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : `translate3d(${x}px, ${y}px, 0)`,
        zIndex: isDragging ? 10 : 1,
        opacity: isToolbarItem && isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className="absolute bg-green-200 p-2 rounded-md cursor-move"
            style={style}
            {...listeners}
            {...attributes}
        >
            {id}
        </div>
    );
}

function DropZone({ droppedItems }: { droppedItems: Array<{ id: string; x: number; y: number }> }) {
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
                <DraggableItem key={item.id} {...item} />
            ))}
        </div>
    );
}

function Index() {
    const [droppedItems, setDroppedItems] = useState<Array<{ id: string; x: number; y: number }>>([]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && over.id === 'drop-zone') {
            const activeRect = active.rect.current.translated;

            if (activeRect) {
                const isNewItem = !droppedItems.some((item) => item.id === active.id);

                if (isNewItem) {
                    setDroppedItems((prevItems) => [
                        ...prevItems,
                        {
                            id: uuidv4(),
                            x: activeRect.left,
                            y: activeRect.top,
                        },
                    ]);
                } else {
                    setDroppedItems((prevItems) =>
                        prevItems.map((item) =>
                            item.id === active.id ? { ...item, x: activeRect.left, y: activeRect.top } : item
                        )
                    );
                }
            }
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Toolbar />
            <DropZone droppedItems={droppedItems} />
            <DragOverlay />
        </DndContext>
    );
}

export default Index;
