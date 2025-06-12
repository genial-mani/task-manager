"use client";

import { getTask } from "@/utils/fetchers";
import { TaskType } from "@/utils/Interfaces";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import PrioritySelector from "@/components/PrioritySelector";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import useTaskStore from "@/hooks/useTaskStore";

export default function TaskModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [task, setTask] = useState<TaskType | null>(null);
  const [taskPriority,setPriority] = useState<string>(task?.priority as string);
  const [formData,setFormData] = useState<Record<string,any>>({
    title: task?.title,
    desc: task?.desc,
    priority: task?.priority,
    start: task?.start,
    end: task?.end,
  });
  const onClickRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const updateTask = useTaskStore((state)=> state.updateTask)

  useEffect(()=>{
    if(taskPriority){
      setFormData((prev)=>({
        ...prev,
        priority: taskPriority,
      }));
    }
  },[taskPriority]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const resolvedParams = await params;
        if (!resolvedParams?.id) {
          console.error("Task ID missing in params:", resolvedParams);
          toast.error("Invalid task ID");
          return;
        }

        const response = await getTask(resolvedParams.id);
        if (!response.ok) {
          const data = await response.json();
          console.error("Error fetching task:", data?.error);
          toast.error(data?.error || "Failed to fetch task");
          return;
        }

        if(response?.ok){
          const result = await response.json();
        setTask(result);
        setPriority(result?.priority as string);
        setFormData(result);
        }
      } catch (error) {
        console.error("Error in fetchTask:", error);
        toast.error("Failed to fetch task");
      }
    };

    fetchTask();
  }, [params]);

  useEffect(()=>{
    const handleOnClick = (event: MouseEvent)=>{
      if(onClickRef?.current && !onClickRef?.current?.contains(event.target as Node)){
        router.back();
      }
    }

    window.addEventListener('click',handleOnClick);
    return ()=>{
      window.removeEventListener('click',handleOnClick)
    }
  },[])

  const handleSubmit = async(event: FormEvent)=>{
    try {
      event.preventDefault();
      const response = await fetch(`/api/tasks/${task?.id}`,{
        method: "PUT",
        credentials: "include",
        cache: "no-store",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if(!response?.ok){
        const data = await response?.json();
        console.log("error updating task:",data?.error);
        toast.error(data?.error);
      }
      const data = await response?.json();
      updateTask(data?.updatedTask);
      toast.success(data?.message);
    } catch (error) {
      
    }
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    const {name, value} = event?.target;
    setFormData((prev) => ({
          ...prev,
          [name]:
            name === "start" || name === "end"
              ? value ? dayjs(value).toISOString() : null
              : value,
        }));

  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-eerie-black bg-opacity-65 px-5 z-50">
      {task ? (
        <form onSubmit={handleSubmit} className="w-full max-w-screen-lg h-fit z-10 bg-opacity-0 mx-auto" ref={onClickRef}>
          <div className="bg-eerie-black text-seasalt w-full max-w-screen-lg h-fit mt-40 flex gap-5 p-5 rounded-xl mx-auto">
          <div className="flex flex-col gap-3 w-full">
          <input
          type="text"
          name="title"
          placeholder="title"
          required
          autoFocus
          className="w-full px-3 py-2 rounded-md text-eerie-black"
          value={formData?.title}
          onChange={handleChange}
        />
            <textarea
          name="desc" 
          placeholder="description"
          className="w-full px-3 py-2 min-h-[190px] rounded-md text-eerie-black"
          value={formData?.desc}
          onChange={handleChange}
        />
          </div>
          <div className="w-56 flex flex-col gap-1">
            <h2>start</h2>
            <div className="w-full max-w-56 flex items-start h-fit p-1 px-2 gap-2 bg-purple-600 rounded-md">
              <input type="datetime-local" name="start" onChange={handleChange} className="bg-transparent text-seasalt" value={formData?.start ? dayjs(formData?.start).format("YYYY-MM-DDTHH:mm") : ""}/>
            </div>
            <h2>end</h2>
            <div className="w-full max-w-56 flex items-start h-fit p-1 px-2 gap-2 bg-purple-600 rounded-md">
            <input type="datetime-local" name="end" onChange={handleChange} className="w-full bg-transparent text-seasalt" value={formData?.end ? dayjs(formData?.end).format("YYYY-MM-DDTHH:mm") : ""} />
            </div>
            <h2>priority</h2>
            <PrioritySelector setPriority={setPriority} taskPriority={taskPriority}/>
          <button type="submit" className="bg-outer-space py-2 rounded-md mt-2">save</button>
          </div>
        </div>
        </form>
      ) : (
        <div className="w-full max-w-full h-[90vh] flex items-center justify-center"><Loading/></div>
      )}
    </div>
  );
}