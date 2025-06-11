"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import PrioritySelector from "./PrioritySelector";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";
import useTaskStore from "@/hooks/useTaskStore";

export default function TaskForm({
  setIsFormOpen,
}: {
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [taskPriority, setPriority] = useState<string>("FIVE");
  const [formData, setFormData] = useState<Record<string, any>>({
    title: "",
    desc: "",
    status: "pending",
    priority: taskPriority,
    start: null,
    end: null,
  });
  const addTask = useTaskStore((state)=> state.addTask)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      priority: taskPriority,
    }));
  }, [taskPriority]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      console.log("formData:", formData);
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response?.ok) {
        const data = await response?.json();
        toast.error(data?.error);
        console.log("error creating task:", data);
        return;
      }
      const data = await response?.json();
      addTask(data?.task);
      setFormData({
        title: "",
        desc: "",
        status: "pending",
        priority: "FIVE",
        start: null,
        end: null,
      });
      setPriority("FIVE");
      setIsFormOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
      toast.error("Error creating task");
    }
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "start" || name === "end"
          ? value
            ? dayjs(value).toISOString()
            : null
          : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "-20px" }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="flex flex-col items-center justify-center text-eerie-black mx-auto mt-20 border-2 bg-seasalt md:max-w-md lg:max-w-xl py-6 px-5 rounded-lg"
    >
      <h2 className=" w-full pb-3 text-2xl flex justify-start">New task</h2>
      <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="title"
          required
          className="w-full px-3 py-2 rounded-md"
          value={formData?.title}
          onChange={handleOnChange}
        />
        <textarea
          name="desc"
          placeholder="description"
          className="w-full px-3 py-2 min-h-20 rounded-md"
          value={formData?.desc}
          onChange={handleOnChange}
        />
        <div className="w-full flex justify-between mb-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="start">start</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              className="outline-none rounded-md p-2"
              value={
                formData?.start
                  ? dayjs(formData?.start).format("YYYY-MM-DDTHH:mm")
                  : ""
              }
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="end">end</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              className="outline-none rounded-md p-2"
              value={
                formData?.end
                  ? dayjs(formData?.end).format("YYYY-MM-DDTHH:mm")
                  : ""
              }
              onChange={handleOnChange}
            />
          </div>
        </div>
        <PrioritySelector
          setPriority={setPriority}
          taskPriority={taskPriority}
        />
        <div className="w-full flex justify-end gap-5">
          <button
            type="button"
            className=" px-3 py-2 bg-red-500 text-seasalt rounded-md"
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" px-3 py-2 bg-onyx text-seasalt rounded-md"
          >
            Add task
          </button>
        </div>
      </form>
    </motion.div>
  );
}
