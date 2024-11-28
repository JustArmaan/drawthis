import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Toolbar() {
    const items = [
        { id: 'item-1', label: 'Schema Blob 1' },
        { id: 'item-2', label: 'Schema Blob 2' },
        { id: 'item-3', label: 'Schema Blob 3' },
    ];

    return (
        <div
            className="fixed top-10 right-10 bg-gray-800 text-white p-4 rounded-md shadow-lg z-10"
            style={{ width: '200px' }}
        >
            <h2 className="mb-4 text-lg font-semibold">Toolbar</h2>
            {items.map((item) => (
                <DraggableItem key={item.id} id={item.id} label={item.label} />
            ))}
        </div>
    );
}

function DraggableItem({ id, label }: { id: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'pointer',
    };

    return (
        <div
            className="p-2 bg-blue-500 rounded-md cursor-pointer text-center mb-4"
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            {label}
        </div>
    );
}
