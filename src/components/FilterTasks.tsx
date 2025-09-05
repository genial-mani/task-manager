import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Funnel } from "lucide-react";
import { Button } from "./ui/button";

const FilterTasks = ({
  handlePriorityFilters,
  priorityFilters,
}: {
  handlePriorityFilters: (p: string, checked: boolean) => void;
  priorityFilters: string[];
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex gap-2 text-slate-800">
          <Funnel size={20} /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-fit">
        <div>
          <div className="flex mt-2 items-center">
            <input
              id="cb1"
              type="checkbox"
              checked={priorityFilters?.includes("ONE")}
              onChange={(e) => handlePriorityFilters(`ONE`, e.target.checked)}
              className={`peer size-6 border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-red-500 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center`}
            />
            <label
              htmlFor="cb1"
              className={`peer-checked:text-red-500 hover:text-red-500 pl-2 cursor-pointer`}
            >
              Urgent
            </label>
          </div>
          <div className="flex mt-2 items-center">
            <input
              id="cb2"
              type="checkbox"
              checked={priorityFilters?.includes("TWO")}
              onChange={(e) => handlePriorityFilters(`TWO`, e.target.checked)}
              className={`peer size-6 border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-orange-500 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center`}
            />
            <label
              htmlFor="cb2"
              className={`peer-checked:text-orange-400 hover:text-orange-400 pl-2 cursor-pointer `}
            >
              High
            </label>
          </div>
          <div className="flex mt-2 items-center">
            <input
              id="cb3"
              type="checkbox"
              checked={priorityFilters?.includes("THREE")}
              onChange={(e) => handlePriorityFilters(`THREE`, e.target.checked)}
              className={`peer size-6 border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-blue-500 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center`}
            />
            <label
              htmlFor="cb3"
              className={`peer-checked:text-blue-500 hover:text-blue-500 pl-2 cursor-pointer`}
            >
              Medium
            </label>
          </div>
          <div className="flex mt-2 items-center">
            <input
              id="cb4"
              type="checkbox"
              checked={priorityFilters?.includes("FOUR")}
              onChange={(e) => handlePriorityFilters(`FOUR`, e.target.checked)}
              className={`peer size-6 border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:bg-yellow-400 checked:after:content-['✔'] checked:after:text-white flex items-center justify-center`}
            />
            <label
              htmlFor="cb4"
              className={`peer-checked:text-yellow-400 hover:text-yellow-400 pl-2 cursor-pointer`}
            >
              Low
            </label>
          </div>
          <div className="flex mt-2 items-center">
            <input
              id="cb5"
              type="checkbox"
              checked={priorityFilters?.includes("FIVE")}
              onChange={(e) => handlePriorityFilters(`FIVE`, e.target.checked)}
              className={`peer size-6 border-[1.2px] border-slate-50 rounded-full cursor-pointer appearance-none checked:after:content-['✔'] checked:after:text-white flex items-center justify-center`}
            />
            <label
              htmlFor="cb5"
              className={`peer-checked:text-slate-50 hover:text-slate-50 pl-2 cursor-pointer`}
            >
              Normal
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterTasks;
