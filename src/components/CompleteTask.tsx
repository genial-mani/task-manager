import useTaskStore from "@/hooks/useTaskStore";
import { completeTask } from "@/utils/fetchers";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export default function CompleteTask({
  taskId,
  setIsDone,
}: {
  taskId: string;
  setIsDone: Dispatch<SetStateAction<boolean>>;
}) {

  const taskDone = useTaskStore((state)=> state.taskDone)

  async function handleClick() {
    try {
      const response = await completeTask(taskId);
      if (!response?.ok) {
        const data = await response?.json();
        toast.error(data?.message);
      }
      const data = await response?.json();

      taskDone(taskId);
      setIsDone(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Error completing task");
    }
  }
  return (
    <label
      onClick={handleClick}
      className="group flex items-center cursor-pointer rounded-full mt-[3px]"
    >
      <input className="hidden peer" type="checkbox" />
      <span className="relative w-5 h-5 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-full shadow-md transition-all duration-500 peer-checked:border-purple-500 peer-checked:bg-purple-500 peer-hover:scale-105 z-0"></span>
    </label>
  );
}
