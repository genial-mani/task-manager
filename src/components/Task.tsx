import { formatDate, priority, priorityFlag, taskbg } from "@/utils/helpers";
import { TaskType } from "@/utils/Interfaces";
import { TiFlag } from "react-icons/ti";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Howl } from "howler";
import Link from "next/link";
import CompleteTask from "./CompleteTask";
import { toast } from "sonner";
import DeleteTask from "./DeleteTask";
import useTaskStore from "@/hooks/useTaskStore";
export default function Task({
  task,
}: {
  task: TaskType;
}) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const sound = new Howl({
    src: ["/pop-sound-effect.mp3"],
    volume: 0.3,
  });

  const deletedId = useTaskStore((state)=> state.deletedId);

  useEffect(() => {
    if (isDone) {
      toast.success("task is done");
      sound.play();
    }
  }, [isDone]);

  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0.5 }}
      animate={
        task?.status === 'completed' || task?.id === deletedId ? { y: -20, opacity: 0, display: "none" } : {}
      }
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "backInOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className={`w-full max-w-2xl h-44 rounded-xl text-seasalt px-3 py-2 flex items-start gap-2 shrink-0 mt-5`}
      style={{ backgroundColor: taskbg(task?.priority) }}
    >
      {task?.status === "pending" && (
        <CompleteTask taskId={task?.id} setIsDone={setIsDone} />
      )}
      <Link href={`/tasks/${task?.id}`} className="w-full h-full">
        <div className="w-full h-full flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-eerie-black">
              {task?.title.length <= 45
                ? task?.title
                : task?.title.slice(0, 45) + "..."}
            </h2>
          </div>
          <p className="text-eerie-black">
            {task?.desc.length <= 100
              ? task?.desc
              : task?.desc.slice(0, 100) + "..."}
          </p>
          <div className="h-full flex items-center justify-between">
            <div className="h-10 w-15 p-2 rounded-xl bg-zinc-500 text-seasalt flex items-center gap-2">
              <TiFlag size={25} color={priorityFlag(task?.priority)} />
              {priority(task?.priority)}
            </div>
            <div className="flex gap-5 text-sm">
              <div className="rounded-md bg-[#f8f9fa] py-1 px-2 w-40 text-center">
                <p className="text-eerie-black">start</p>
                <p className="text-purple-500">
                  {task?.start ? formatDate(task?.start) : "-"}
                </p>
              </div>
              <div className="rounded-md bg-[#f8f9fa] py-1 px-2 w-40 text-center">
                <p className="text-eerie-black">end</p>
                <p className="text-purple-500">
                  {task?.end ? formatDate(task?.end) : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <DeleteTask taskId={task?.id} />
    </motion.div>
  );
}
