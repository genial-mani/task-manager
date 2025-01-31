"use client";
import { IoAdd } from "react-icons/io5";
import { MdFilterAlt } from "react-icons/md";
import { MdOutlineSort } from "react-icons/md";
import { useEffect, useState } from "react";
import Task from "@/components/Task";
import { TaskType } from "@/utils/Interfaces";
import { toast } from "sonner";
import TaskForm from "@/components/TaskForm";

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newTask,setNewTask] = useState<TaskType | null>(null)

  useEffect(()=>{
    if(newTask){
      setTasks((prev)=>[newTask, ...prev]);
    }
  },[newTask])


  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await fetch("/api/tasks",{
          method: "GET",
        });

        if (!response.ok) {
          // Only attempt to parse JSON if the content-type header suggests it
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.error(
              "Error fetching tasks:",
              data?.message || response.statusText
            );
            toast.error(data?.message || response.statusText);
          } else {
            // Handle non-JSON error responses (e.g., plain text)
            const errorMessage = await response.text();
            console.error(
              "Error fetching tasks:",
              errorMessage || response.statusText
            );
            toast.error(errorMessage || response.statusText);
          }
          return; // Crucial: Stop execution after handling the error
        }

        const result = await response.json();
        setTasks(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("An unexpected error occurred."); // More user-friendly message
      }
    };

    fetchAllTasks();
  }, []);

  return (
    <div className="w-full max-w-full px-5 pt-5 min-h-screen">
      <div className="relative h-12 flex items-center justify-between">
        <div
          onClick={() => setIsFormOpen(!isFormOpen)}
          className=" flex items-center justify-center gap-2 rounded-xl bg-eerie-black py-2 px-3 text-seasalt cursor-pointer"
        >
          <IoAdd size={25} />
          <p>Add task</p>
        </div>
          <div className={`${isFormOpen ? 'fixed' : 'hidden'} w-full max-w-full min-h-screen top-0 left-0 bg-eerie-black bg-opacity-60 z-50`}>
            <TaskForm setNewTask={setNewTask} setIsFormOpen={setIsFormOpen}/>
          </div>
        <div className="flex items-center justify-center gap-10 pr-5">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-black py-2 px-3 text-seasalt cursor-pointer">
            <MdFilterAlt size={25} color="white" />
            Filter
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-black px-3 py-2 text-seasalt cursor-pointer">
            <MdOutlineSort size={25} />
            Sort
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl pt-5 mx-auto">
        {tasks && tasks?.map((task: TaskType) => (
          <Task task={task} key={task?.id} />
        ))}
      </div>
    </div>
  );
}
