import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { MdOutlineSort } from "react-icons/md";

const SortTasks = ({
  setSortBy,
  sortBy,
}: {
  setSortBy: Dispatch<SetStateAction<string | null>>;
  sortBy: string | null;
}) => {
  return (
    <Popover>
      <PopoverTrigger
        asChild
      >
        <Button className="flex gap-2 ">
          <MdOutlineSort size={20} /> Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-fit">
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
      </PopoverContent>
    </Popover>
  );
};

export default SortTasks;
