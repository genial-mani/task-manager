import { CategoryType, TaskType } from '@/utils/Interfaces'
import {create} from 'zustand'
import { persist } from 'zustand/middleware'

interface TaskStore {
    tasks: TaskType[],
    categories: CategoryType[],
    setCategories: (categories: CategoryType[])=> void,
    deleteCategory: (categoryId: string)=> void,
    addCategory: (category: CategoryType)=> void,
    setTasks: (tasks: TaskType[])=> void,
    addTask: (task: TaskType)=> void,
    taskDone: (id: string)=> void,
    updateTask: (updatedTask: TaskType)=> void,
    deletedId: (string | null),
    setDeletedId: (id: string | null)=> void,
}

const useTaskStore =  create<TaskStore>()(
    persist((set)=> ({
    tasks:[],
    categories: [],
    setCategories: (cats: CategoryType[])=> set({categories: cats}),
    deleteCategory: (categoryId: string)=> set((state)=> ({
        categories: state.categories?.filter((cat)=> cat?.id !== categoryId)
    })),
    addCategory: (category: CategoryType)=> set((state)=> ({
        categories: state.categories ? [...state.categories, category] : [category]
    })),
    setTasks: (ts: TaskType[])=> set({tasks: ts}),
    addTask: (task: TaskType)=> set((state)=> ({
        tasks: [task, ...state.tasks],
    })),
    taskDone: (id: string)=> set((state)=> ({
        tasks: state.tasks.map((task)=> task.id === id ? {...task, status: 'completed'} : task)
    })),
    updateTask: (updatedTask: TaskType)=> set((state)=>({
        tasks: state.tasks.map((task)=> task?.id === updatedTask?.id ? {...task, ...updatedTask}: task)
    })),
    deletedId: null,
    setDeletedId: (id: string | null)=> set({deletedId: id}),
}),
{
    name: 'task-storage', // unique name for the storage
}
))


export default useTaskStore;