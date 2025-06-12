import { TaskType } from '@/utils/Interfaces'
import {create} from 'zustand'
import { persist } from 'zustand/middleware'

interface TaskStore {
    tasks: TaskType[],
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