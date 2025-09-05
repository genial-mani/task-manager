"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { priorityFlag } from "@/utils/helpers";
import { TiFlag } from "react-icons/ti";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "sonner";
import useTaskStore from "@/hooks/useTaskStore";
import { Textarea } from "./ui/textarea";
import { Icon } from "@iconify/react";

export function AddTask() {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const addTask = useTaskStore((state) => state.addTask);
  const [isLoading, setIsLoading] = useState(false);
  const categories = useTaskStore((state) => state.categories);

  const formSchema = z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required." })
      .max(100, { message: "Title must be under 100 characters." }),
    desc: z.string().trim().max(1500).optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    priority: z.enum(["ONE", "TWO", "THREE", "FOUR", "FIVE"]),
    categoryId: z.enum(categories.map(cat => cat.id)),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log("formData:", data);
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response?.ok) {
        setIsLoading(false);
        const data = await response?.json();
        toast.error(data?.error);
        console.log("error creating task:", data);
        return;
      }
      const res = await response?.json();
      addTask(res?.task);
      form.reset({
        title: "",
        desc: "",
        start: undefined,
        end: undefined,
        priority: "FIVE",
        categoryId: categories.find(cat => cat.name === "Inbox")?.id,
      });
      setStartTime("10:00");
      setEndTime("11:00");
      setIsLoading(false);
      toast.success("Task created successfully");
    } catch (error) {
      setIsLoading(false);
      console.log("Error creating task", error);
      toast.error("Error creating task");
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      start: undefined,
      end: undefined,
      priority: "FIVE",
      categoryId: categories.find(cat => cat.name === "Inbox")?.id,
    },
  });

  function combineDateTime(date: Date | undefined, time: string | undefined) {
    if (!date) return undefined;
    if (!time) return date.toISOString();
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours ?? 0);
    newDate.setMinutes(minutes ?? 0);
    newDate.setSeconds(seconds ?? 0);
    newDate.setMilliseconds(0);
    return newDate.toISOString();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 text-seasalt pt-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Title *</FormLabel>
              <FormControl>
                <Input placeholder="title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="description"
                  {...field}
                  className="resize-y min-h-[80px] max-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => {
            // Parse ISO string to Date for Calendar
            const dateValue = field.value ? parseISO(field.value) : undefined;

            return (
              <FormItem>
                <FormLabel className="flex items-center">Start</FormLabel>
                <div className="flex gap-2">
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-auto justify-between font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue && isValid(dateValue)
                          ? format(dateValue, "PPP p")
                          : "Pick a date & time"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0 z-50"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          dateValue && isValid(dateValue)
                            ? dateValue
                            : undefined
                        }
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          const iso = combineDateTime(date!, startTime);
                          field.onChange(iso);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      const iso = combineDateTime(
                        dateValue ?? new Date(),
                        e.target.value
                      );
                      field.onChange(iso);
                    }}
                    step="60"
                    className="w-fit"
                  />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="end"
          render={({ field }) => {
            const dateValue = field.value ? parseISO(field.value) : undefined;
            return (
              <FormItem>
                <FormLabel className="flex items-center">End</FormLabel>
                <div className="flex gap-2">
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-fit justify-between font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue && isValid(dateValue)
                          ? format(dateValue, "PPP p")
                          : "Pick a date & time"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0 z-50"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          dateValue && isValid(dateValue)
                            ? dateValue
                            : undefined
                        }
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          const iso = combineDateTime(date!, endTime);
                          field.onChange(iso);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      const iso = combineDateTime(
                        dateValue ?? new Date(),
                        e.target.value
                      );
                      field.onChange(iso);
                    }}
                    step="60"
                    className="w-fit"
                  />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex gap-5 items-center">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">Priority *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Prioritise the task." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-36">
                    <SelectItem value="ONE">
                      <div className="flex gap-2">
                        <TiFlag size={20} color={priorityFlag("ONE")} />
                        <p>Urgent</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="TWO">
                      <div className="flex gap-2">
                        <TiFlag size={20} color={priorityFlag("TWO")} />
                        <p>High</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="THREE">
                      <div className="flex gap-2">
                        <TiFlag size={20} color={priorityFlag("THREE")} />
                        <p>Medium</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="FOUR">
                      <div className="flex gap-2">
                        <TiFlag size={20} color={priorityFlag("FOUR")} />
                        <p>Low</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="FIVE">
                      <div className="flex gap-2">
                        <TiFlag size={20} color={priorityFlag("FIVE")} />
                        <p>Normal</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Categorise the task." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-36">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                      >
                        <div className="flex gap-2">
                          <Icon
                          icon="ph:hash-light"
                          width="1.2em"
                          height="1.2em"
                          style={{ color: "#7500b8" }}
                        />
                        <p>{cat.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          {isLoading && <LoaderCircleIcon className="animate-spin mr-1" />}
          Add
        </Button>
      </form>
    </Form>
  );
}
