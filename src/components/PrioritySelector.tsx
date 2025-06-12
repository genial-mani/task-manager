"use client";

import { priority, priorityFlag } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { TiFlag } from "react-icons/ti";

export default function PrioritySelector({ taskPriority, setPriority}: { taskPriority: string, setPriority: React.Dispatch<React.SetStateAction<string>>}) {
  const [toggle, setToggle] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityValues = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];

  useEffect(() => {
    console.log("P:", taskPriority);
    console.log(toggle);
  }, [taskPriority, toggle]);

  useEffect(()=>{
    const handleOutsideClick = (event: MouseEvent)=>{

        if(dropdownRef?.current && !dropdownRef?.current?.contains(event?.target as Node)){
            setToggle(false);
        }
    
      };
      window.addEventListener("click",handleOutsideClick);
    
        return ()=>{
            window.removeEventListener("click",handleOutsideClick);
        };
  },[])
  
  return (
    <div className="relative group w-full max-w-56 flex items-center h-fit p-1 px-2 justify-between bg-purple-600 rounded-md">
      <div
        className="w-full flex items-center gap-2 cursor-pointer"
        ref={dropdownRef}
        onClick={() => setToggle(!toggle)}
        id="dropdown-button"
      >
        <TiFlag size={20} color={priorityFlag(taskPriority)} />
        {priority(taskPriority)}
        <GoChevronDown size={20} />
      </div>
      <div
        className={`${
          toggle ? "flex" : "hidden"
        } absolute left-0 top-9 flex-col w-full max-w-56 bg-purple-600 rounded-md overflow-hidden`}
        id="dropdown-menu"
      >
        {priorityValues?.map((value, index) => (
          <div
            key={index}
            className="w-full max-w-56 flex items-center h-fit p-1 px-4 justify-between hover:bg-purple-700 cursor-pointer"
            onClick={() => {
              setPriority(value);
              setToggle(false);
            }}
          >
            <TiFlag size={20} color={priorityFlag(value)} />
            <p>{priority(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
