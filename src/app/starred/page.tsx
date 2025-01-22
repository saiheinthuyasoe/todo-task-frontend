// src/app/starred/page.tsx

'use client';

import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { getTasks, toggleStar, toggleComplete, deleteTask, updateTask } from '../api/tasks';
import { FaTrashAlt, FaSort } from 'react-icons/fa';
import { Task } from '../../types/task';

export default function StarredPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOption, setDeleteOption] = useState<'all' | 'completed' | 'unfinished'>('all');
  const [sortOption, setSortOption] = useState<'date' | 'title' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch starred tasks from the API
  const fetchStarredTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      const starredTasks = data.filter((task: Task) => task.starred);
      setTasks(starredTasks);
    } catch (error) {
      console.error('Error fetching starred tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStarredTasks();
  }, []);

  // Handlers for actions
  const handleToggleStar = async (id: number) => {
    try {
      await toggleStar(id);
      await fetchStarredTasks(); // Refetch tasks to keep the UI updated
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleComplete(id);
      await fetchStarredTasks(); // Refetch tasks to keep the UI updated
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      await fetchStarredTasks(); // Refetch tasks to keep the UI updated
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteAllStarredTasks = async () => {
    try {
      const tasksToDelete =
        deleteOption === 'completed'
          ? tasks.filter((task) => task.completed)
          : deleteOption === 'unfinished'
          ? tasks.filter((task) => !task.completed)
          : tasks;

      await Promise.all(tasksToDelete.map((task) => deleteTask(task.id)));
      await fetchStarredTasks(); // Refetch tasks to keep the UI updated
    } catch (error) {
      console.error('Error deleting all starred tasks:', error);
    }
  };

  const handleEditTask = async (id: number, title: string, description?: string) => {
    try {
      const updatedTask = { title, description };
      await updateTask(id, updatedTask);
      await fetchStarredTasks(); // Refetch tasks to keep the UI updated
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeleteOption(e.target.value as 'all' | 'completed' | 'unfinished');
  };

  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'date' | 'title' | 'status');
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
    return sortOrder === 'asc' ? Number(a.completed) - Number(b.completed) : Number(b.completed) - Number(a.completed);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Starred Tasks</h1>
      
      <div className="flex justify-between items-center mb-4">
        {/* Move Sort to Left */}
        <div className="flex items-center space-x-2">
          <select
            title="Sort Options"
            onChange={handleSortOptionChange}
            value={sortOption}
            className="border p-2 rounded-md"
          >
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

        {/* Move Delete to Right */}
        <div className="flex items-center space-x-2">
          <select
            title="Delete Options"
            onChange={handleDeleteOptionChange}
            value={deleteOption}
            className="border p-2 rounded-md"
          >
            <option value="all">All Starred Tasks</option>
            <option value="completed">Completed Starred Tasks</option>
            <option value="unfinished">Unfinished Starred Tasks</option>
          </select>
          <button
            type="button"
            onClick={handleDeleteAllStarredTasks}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            title="Delete Selected Starred Tasks"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
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
      ) : (
        <p>No starred tasks available.</p>
      )}
    </div>
  );
}
