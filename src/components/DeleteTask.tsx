"use client";

import useTaskStore from "@/hooks/useTaskStore";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

export default function DeleteTask({
  taskId,
}: {
  taskId: string;
}) {

  const setDeletedId = useTaskStore((state)=> state.setDeletedId);
  async function handleDelete() {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response?.ok) {
        const data = await response?.json();
        console.log("Error deleting task", data);
        toast.error(data?.error);
      }
      if (response?.ok) {
        setDeletedId(taskId)
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting task");
      console.log("Error deleting task", error);
    }
  }
  return (
    <div
      className="p-2 bg-[#f8f9fa] rounded-lg cursor-pointer"
      onClick={handleDelete}
    >
      <MdDelete size={20} fill="#a855f7" />
    </div>
  );
}
