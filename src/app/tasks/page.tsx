"use client";
import { IoAdd } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Task from "@/components/Task";
import { TaskType } from "@/utils/Interfaces";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "motion/react";
import { priorityValues } from "@/utils/helpers";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import useTaskStore from "@/hooks/useTaskStore";
import FilterTasks from "@/components/FilterTasks";
import SortTasks from "@/components/SortTasks";
import {AddTask} from "@/components/AddTask";

export default function Tasks() {
  // const [tasks, setNewTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const ztasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tasks", {
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
            setLoading(false);
            toast.error(data?.message || response.statusText);
          } else {
            // Handle non-JSON error responses (e.g., plain text)
            const errorMessage = await response.text();
            console.error(
              "Error fetching tasks:",
              errorMessage || response.statusText
            );
            setLoading(false);
            toast.error(errorMessage || response.statusText);
          }
          return;
        }

        const { pendingTasks } = await response.json();
        setTasks(Array.isArray(pendingTasks) ? pendingTasks : []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching tasks:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    fetchAllTasks();
  }, []);

  const handleStatusFilter = (checked: boolean) => {
    if (checked) {
      setStatusFilter("finished");
    } else {
      setStatusFilter("pending");
    }
  };

  const handlePriorityFilters = (p: string, checked: boolean) => {
    setPriorityFilters((prev) =>
      checked ? [...prev, p] : prev?.filter((pre) => pre !== p)
    );
  };

  useEffect(() => {
    const filtered = ztasks?.filter((t) => {
      const priorityMatch =
        priorityFilters?.length > 0
          ? priorityFilters?.includes(t?.priority)
          : true;
      const statusMatch = statusFilter ? t?.status === statusFilter : true;
      return priorityMatch && statusMatch;
    });
    setFilteredTasks(sortTasks(filtered));
    console.log(sortBy);
  }, [priorityFilters, statusFilter, ztasks, sortBy]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        filterDropdownRef?.current &&
        !filterDropdownRef?.current?.contains(event.target as Node) &&
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (
        sortRef?.current &&
        !sortRef?.current?.contains(event.target as Node) &&
        sortDropdownRef?.current &&
        !sortDropdownRef?.current?.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const sortTasks = (tasksToSort: TaskType[]) => {
    if (!sortBy) return tasksToSort;

    return [...tasksToSort].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityValues(a.priority) - priorityValues(b.priority);
      } else if (sortBy === "startDate") {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      } else if (sortBy === "endDate") {
        return new Date(a.end).getTime() - new Date(b.end).getTime();
      }
      return 0;
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-full h-[90vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-5 min-h-screen">
      <div className="relative h-12 flex items-center justify-between">
        <div className="flex gap-2">
          <Dialog >
  <DialogTrigger className="flex items-center justify-center gap-2 rounded-xl bg-eerie-black py-2 px-3 text-seasalt cursor-pointer"><IoAdd size={25} />
            <p>Add task</p></DialogTrigger>
  <DialogContent className=" max-h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden">
    <DialogHeader>
      <DialogTitle className="text-seasalt mb-2">New Task</DialogTitle>
      <AddTask/>
    </DialogHeader>
  </DialogContent>
</Dialog>
        </div>
        <div className="relative flex items-center justify-center gap-10 pr-5">
          <FilterTasks
            handlePriorityFilters={handlePriorityFilters}
            priorityFilters={priorityFilters}
          />
          <SortTasks setSortBy={setSortBy} sortBy={sortBy} />
        </div>
      </div>
      {ztasks?.length > 0 ? (
        <div className="w-full max-w-2xl pt-5 mx-auto mb-5">
          {filteredTasks?.length > 0 ? (
            filteredTasks?.map((task: TaskType) => (
              <Task task={task} key={task?.id} />
            ))
          ) : (
            <div className="w-full max-w-full mt-[25vh] flex items-center justify-center">
              <NotFound
                title="No tasks found"
                desc="Try changing the filters."
              />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-full h-[70vh] flex items-center justify-center">
          <NotFound
            title="No tasks found"
            desc="Add a new task to get started."
          />
        </div>
      )}
    </div>
  );
}
