import { useState } from 'react';

interface TaskFormProps {
  onCreate: (task: { title: string; description?: string }) => void;
}

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({ title, description });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-700">Create a New Task</h2>

      {/* Title Input */}
      <div>
        <label htmlFor="task-title" className="block text-gray-600 font-medium mb-1">
          Task Title
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
          aria-label="Task title"
        />
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-gray-600 font-medium mb-1"
        >
          Task Description
        </label>
        <textarea
          id="task-description"
          placeholder="Enter task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
          aria-label="Task description"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
