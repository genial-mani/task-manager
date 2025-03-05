"use client";

import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

export default function DeleteTask({ taskId,setIsDelete }: { taskId: string,setIsDelete:React.Dispatch<React.SetStateAction<boolean>> }) {

    async function handleDelete(){
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            credentials: "include",
          });
          if(!response?.ok){
            const data = await response?.json();
            console.log("Error deleting task",data);
            toast.error(data?.error);
          }
          if(response?.ok){
            setIsDelete(true);
            toast.success("Task deleted successfully");
          }
        } catch (error) {
          toast.error("Error deleting task");
          console.log("Error deleting task",error);
        }
      }
  return (
    <div
      className="p-2 bg-onyx rounded-lg cursor-pointer"
      onClick={handleDelete}
    >
      <MdDelete size={20} fill="#a855f7" />
    </div>
  );
}
