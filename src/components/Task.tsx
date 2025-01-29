import { formatDate, priority, priorityFlag } from "@/utils/helpers";
import { TaskType } from "@/utils/Interfaces";
import { TiFlag } from "react-icons/ti";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Howl } from "howler";
import Link from "next/link";
import CompleteTask from "./CompleteTask";
import { toast } from "sonner";
export default function Task({ task }: { task: TaskType }) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const sound = new Howl({
    src: ["/pop-sound-effect.mp3"],
    volume: 0.3,
  });
  useEffect(() => {
    if (isDone) {
      toast.success('task is done')
      sound.play();
    }
  }, [isDone]);
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={isDone ? { y: -20, opacity: 0, display: "none" } : {}}
      className="w-full max-w-2xl h-44 rounded-xl bg-eerie-black text-seasalt px-3 py-2 flex items-start gap-2 shrink-0 mt-5"
    >
      <CompleteTask taskId={task?.id} setIsDone={setIsDone} />
      <div className="w-full h-full flex flex-col gap-2">
        <Link href={`/tasks/${task?.id}`}>
          <h2 className="text-lg font-semibold">
            {task?.title.length <= 45
              ? task?.title
              : task?.title.slice(0, 45) + "..."}
          </h2>
        </Link>
        <p>
          {task?.desc.length <= 100
            ? task?.desc
            : task?.desc.slice(0, 100) + "..."}
        </p>
        <div className="h-full flex items-center justify-between">
          <div className="h-10 w-15 p-2 rounded-xl bg-onyx text-seasalt flex items-center gap-2">
            <TiFlag size={25} color={priorityFlag(task?.priority)} />
            {priority(task?.priority)}
          </div>
          <div className="flex gap-5 text-sm">
            <div className="rounded-md bg-onyx py-1 px-2 w-40 text-center">
              <p>start</p>
              <p className="text-purple-500">
                {task?.start ? formatDate(task?.start) : '-'}
              </p>
            </div>
            <div className="rounded-md bg-onyx py-1 px-2 w-40 text-center">
              <p>end</p>
              <p className="text-purple-500">
                {task?.end ? formatDate(task?.end) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
