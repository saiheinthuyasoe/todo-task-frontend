// src/app/api/tasks.ts

import axios from 'axios';

const API_URL = '/api/tasks';

export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task: { title: string; description?: string }) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (
  id: number,
  updates: { title?: string; description?: string; isStarred?: boolean; isCompleted?: boolean }
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const toggleStar = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/star`);
    return response.data;
  } catch (error) {
    console.error('Error toggling star:', error);
    throw error;
  }
};

export const toggleComplete = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error toggling complete:', error);
    throw error;
  }
};
