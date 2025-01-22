// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import { getTasks, createTask, toggleStar, toggleComplete, deleteTask, updateTask } from './api/tasks';
import { FaSort, FaTrashAlt } from 'react-icons/fa';
import { Task } from '../types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<'date' | 'title' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteOption, setDeleteOption] = useState<'all' | 'completed' | 'unfinished'>('all');

  // Fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (task: { title: string; description?: string }) => {
    setIsLoading(true);
    try {
      const newTask = await createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStar = async (id: number) => {
    await toggleStar(id);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, starred: !task.starred } : task
    );
    setTasks(updatedTasks);
  };

  const handleToggleComplete = async (id: number) => {
    await toggleComplete(id);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleDeleteAllTasks = async () => {
    const tasksToDelete =
      deleteOption === 'completed'
        ? tasks.filter((task) => task.completed)
        : deleteOption === 'unfinished'
        ? tasks.filter((task) => !task.completed)
        : tasks;

    await Promise.all(tasksToDelete.map((task) => deleteTask(task.id)));
    setTasks((prevTasks) =>
      deleteOption === 'completed'
        ? prevTasks.filter((task) => !task.completed)
        : deleteOption === 'unfinished'
        ? prevTasks.filter((task) => task.completed)
        : []
    );
  };

  const handleEditTask = async (id: number, title: string, description?: string) => {
    const updatedTask = {
      id,
      title,
      description: description || '',
    };

    // Update the task in the API
    await updateTask(id, updatedTask);

    // Update the task in the local state immediately
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title, description: description || '' } : task
    );
    setTasks(updatedTasks);
  };

  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'date' | 'title' | 'status');
  };

  const handleDeleteOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeleteOption(e.target.value as 'all' | 'completed' | 'unfinished');
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === 'date') {
      return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    }
    if (sortOption === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortOption === 'status') {
      if (sortOrder === 'asc') {
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      } else {
        return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
      }
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <TaskForm onCreate={handleCreateTask} />
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center">
          <select title="Sort Options" onChange={handleSortOptionChange} value={sortOption} className="border p-2 rounded-md">
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button type="button"
            onClick={toggleSortOrder}
            className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            title="Toggle Sort Order"
          >
            <FaSort />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            title="Delete Options"
            onChange={handleDeleteOptionChange}
            value={deleteOption}
            className="border p-2 rounded-md"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="unfinished">Unfinished Tasks</option>
          </select>
          <button
            onClick={handleDeleteAllTasks}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            title="Delete Selected Tasks"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStar={handleToggleStar}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
