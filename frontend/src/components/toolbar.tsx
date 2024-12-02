import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Toolbar() {
    const items = [
        {
            id: 'table-1',
            label: 'Basic Table',
            type: 'table',
            columns: [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'varchar' },
            ],
        },
        {
            id: 'table-2',
            label: 'User Table',
            type: 'table',
            columns: [
                { name: 'user_id', type: 'int' },
                { name: 'username', type: 'varchar' },
                { name: 'email', type: 'varchar' },
            ],
        },
        {
            id: 'table-3',
            label: 'Product Table',
            type: 'table',
            columns: [
                { name: 'product_id', type: 'int' },
                { name: 'product_name', type: 'varchar' },
                { name: 'price', type: 'decimal' },
            ],
        },
    ];

    return (
        <div
            className="fixed top-10 right-10 bg-gray-800 text-white p-4 rounded-md shadow-lg z-10"
            style={{ width: '250px' }}
        >
            <h2 className="mb-4 text-lg font-semibold">Schema Tables</h2>
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
