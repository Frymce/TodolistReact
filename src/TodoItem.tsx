import { Edit, Trash, Check, X } from "lucide-react";
import { useState } from "react";

type Priority = 'Urgente' | 'Moyenne' | 'Basse';

type Todo = {
    id: number;
    text: string;
    priority: Priority;
}

type TodoItemProps = {
    todo: Todo
    onDelete: () => void
    isSelected: boolean
    onToggleSelect: (id: number) => void
    onEdit: (id: number, newText: string) => void;
};
const TodoItem = ({ todo, onDelete, isSelected, onToggleSelect, onEdit }: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(todo.id, editText.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <li className="p-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <input type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={isSelected}
                        onChange={() => onToggleSelect(todo.id)}
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input input-bordered input-sm w-full max-w-xs"
                            autoFocus
                        />
                    ) : (
                        <span className="text-md font-bold">
                            <span>
                                {todo.text}
                            </span>
                        </span>
                    )}
                    <span className={`badge badge-sm badge-soft ${todo.priority === 'Urgente' ? 'badge-error' : todo.priority === 'Moyenne' ? 'badge-warning' : 'badge-success'}`}>
                        {todo.priority}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="btn btn-sm btn-success btn-soft">
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-sm btn-ghost btn-soft">
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-sm btn-primary btn-soft">
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="btn btn-sm btn-error btn-soft">
                        <Trash className="w-4 h-4" />
                    </button>

                </div>
            </div>
        </li>

    );
};

export default TodoItem;