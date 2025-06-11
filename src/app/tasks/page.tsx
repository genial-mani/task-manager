"use client";
import { IoAdd } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Task from "@/components/Task";
import { TaskType } from "@/utils/Interfaces";
import { toast } from "sonner";
import TaskForm from "@/components/TaskForm";
import { motion } from "motion/react";
import { priorityValues } from "@/utils/helpers";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import { Icon } from "@iconify/react";
import useTaskStore from "@/hooks/useTaskStore";

export default function Tasks() {
  // const [tasks, setNewTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
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
    <div className="w-full max-w-full px-5 pt-5 min-h-screen">
      <div className="relative h-12 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsFormOpen(!isFormOpen)}
          className=" flex items-center justify-center gap-2 rounded-xl bg-eerie-black py-2 px-3 text-seasalt cursor-pointer"
        >
          <IoAdd size={25} />
          <p>Add task</p>
        </motion.div>
        <motion.div
          className={`${
            isFormOpen ? "fixed" : "hidden"
          } w-full max-w-full min-h-screen top-0 left-0 bg-eerie-black bg-opacity-60 z-50`}
        >
          <TaskForm setIsFormOpen={setIsFormOpen} />
        </motion.div>
        <div className="relative flex items-center justify-center gap-10 pr-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            ref={filterDropdownRef}
            className="flex items-center justify-center gap-2 rounded-xl bg-black py-2 px-3 text-seasalt cursor-pointer"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Icon icon="line-md:filter" width="24" height="24" />
            <p>Filter</p>
          </motion.div>
          <motion.div
            ref={dropdownRef}
            animate={
              isFilterOpen ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            className={`${
              isFilterOpen ? "absolute" : "hidden"
            } top-12 -left-[10px] min-w-fit min-h-fit bg-black text-seasalt p-2 rounded-xl`}
          >
            <div className="flex mt-2 items-center">
              <input
                id="cb1"
                type="checkbox"
                onChange={(e) => handlePriorityFilters("ONE", e.target.checked)}
                className="peer size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-red-600 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center"
              />
              <label
                htmlFor="cb1"
                className="pl-2 peer-checked:text-red-500 hover:text-red-600 cursor-pointer"
              >
                Priority 1
              </label>
            </div>
            <div className="flex mt-2">
              <input
                id="cb2"
                type="checkbox"
                onChange={(e) => handlePriorityFilters("TWO", e.target.checked)}
                className="peer size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-orange-400 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center"
              />
              <label
                htmlFor="cb2"
                className="pl-2 peer-checked:text-orange-400 hover:text-orange-400 cursor-pointer"
              >
                Priority 2
              </label>
            </div>
            <div className="flex mt-2">
              <input
                id="cb3"
                type="checkbox"
                onChange={(e) =>
                  handlePriorityFilters("THREE", e.target.checked)
                }
                className="peer size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-blue-600 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center"
              />
              <label
                htmlFor="cb3"
                className="pl-2 peer-checked:text-blue-500 hover:text-blue-500 cursor-pointer"
              >
                Priority 3
              </label>
            </div>
            <div className="flex mt-2">
              <input
                id="cb4"
                type="checkbox"
                onChange={(e) =>
                  handlePriorityFilters("FOUR", e.target.checked)
                }
                className="peer size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-yellow-300 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center"
              />
              <label
                htmlFor="cb4"
                className="pl-2 peer-checked:text-yellow-300 hover:text-yellow-300 cursor-pointer"
              >
                Priority 4
              </label>
            </div>
            <div className="flex mt-2">
              <input
                id="cb5"
                type="checkbox"
                onChange={(e) =>
                  handlePriorityFilters("FIVE", e.target.checked)
                }
                className="size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-white checked:after:content-['✔'] checked:after:text-black flex items-center justify-center"
              />
              <label htmlFor="cb5" className="pl-2 cursor-pointer">
                Priority 5
              </label>
            </div>
            <div className="flex mt-2">
              <input
                id="cb6"
                type="checkbox"
                onChange={(e) => handleStatusFilter(e.target.checked)}
                className="size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:after:content-['✔'] flex items-center justify-center"
              />
              <label htmlFor="cb6" className="pl-2 cursor-pointer">
                Finished
              </label>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-3 py-2 text-seasalt cursor-pointer"
            onClick={() => setIsSortOpen(!isSortOpen)}
            ref={sortRef}
          >
            <MdOutlineSort size={25} />
            Sort
          </motion.div>
          <motion.div
            animate={
              !isSortOpen ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 0.3 }}
            ref={sortDropdownRef}
            className={`${
              isSortOpen ? "absolute" : "hidden"
            } top-12 left-[115px] min-w-fit min-h-fit bg-black text-seasalt p-2 rounded-xl`}
          >
            {["priority", "startDate", "endDate"].map((option) => (
              <div className="flex mt-2" key={option}>
                <input
                  id={`sortBy-${option}`}
                  type="checkbox"
                  checked={sortBy === option}
                  onChange={() => setSortBy(sortBy === option ? null : option)}
                  className="size-6 bg-transparent border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:after:content-['✔'] flex items-center justify-center"
                />
                <label
                  htmlFor={`sortBy-${option}`}
                  className="pl-2 min-w-fit cursor-pointer"
                >
                  {option === "priority"
                    ? "Priority"
                    : option === "startDate"
                    ? "Start Date"
                    : "End Date"}
                </label>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      {ztasks?.length > 0 ? (
        <div className="w-full max-w-2xl pt-5 mx-auto mb-5">
          {filteredTasks?.length > 0 ? (
            filteredTasks?.map((task: TaskType) => (
              <Task
                task={task}
                key={task?.id}
              />
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
