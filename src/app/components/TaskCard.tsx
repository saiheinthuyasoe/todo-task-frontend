// src/app/components/TaskCard.tsx

import {
  FaStar,
  FaCheckCircle,
  FaRegCircle,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import { useState } from "react";
import { Task } from "../../types/task"; // Import the task interface

interface TaskCardProps {
  task: Task; // Use the imported task interface
  onToggleStar: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string, description?: string) => void;
}

const TaskCard = ({
  task,
  onToggleStar,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, newTitle, newDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(task.title);
    setNewDescription(task.description);
    setIsEditing(false);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 border rounded-lg shadow-md flex flex-col gap-4 md:flex-row justify-between items-start md:items-center max-w-full bg-white hover:shadow-lg transition-shadow">
      <div className="flex flex-col flex-grow gap-2">
        {/* Completed Button and Text */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`p-3 rounded-full ${
              task.completed
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            title="Toggle Complete"
          >
            {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
          </button>

          <div className="flex flex-col">
            {isEditing ? (
              // When editing, show input fields
              <>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-lg font-bold p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                  title="Task Title"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="text-sm p-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  title="Task Description"
                />
              </>
            ) : (
              // Display title and description normally
              <>
                <h3
                  className={`text-lg font-bold ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                  style={{ wordBreak: "break-word" }}
                  title={task.title}
                >
                  {task.title}
                </h3>
                <p
                  className="text-sm text-gray-600"
                  style={{ wordBreak: "break-word" }}
                  title={task.description}
                >
                  {task.description}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-400 mt-2">
          <p>Created: {formatDate(task.createdAt)}</p>
          <p>Last Updated: {formatDate(task.updatedAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* Star Button */}
        <button
          onClick={() => onToggleStar(task.id)}
          className={`p-3 rounded-full ${
            task.starred ? "text-yellow-500" : "text-gray-400"
          } hover:text-yellow-600`}
          title="Toggle Star"
        >
          <FaStar />
        </button>

        {isEditing ? (
          // Show save and cancel buttons when editing
          <>
            <button
              onClick={handleSave}
              className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600"
              title="Save Task"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600"
              title="Cancel Edit"
            >
              Cancel
            </button>
          </>
        ) : (
          // Edit Button
          <button
            onClick={handleEditClick}
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600"
            title="Edit Task"
          >
            <FaEdit />
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
          title="Delete Task"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
