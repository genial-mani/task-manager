"use client";

import Loading from "@/components/Loading";
import PriorityDoughnutChart from "@/components/PriorityDoughnut";
import { getDashboardStats } from "@/utils/fetchers";
import { dashboardStats } from "@/utils/Interfaces";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import NotFound from "@/components/NotFound";
import { IoInformationCircle } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<dashboardStats>({
    totalTasks: 0,
    totalPendingTasks: 0,
    totalFinishedTasks: 0,
    p1Tasks: 0,
    p2Tasks: 0,
    p3Tasks: 0,
    p4Tasks: 0,
    p5Tasks: 0,
    pp1Tasks: 0,
    pp2Tasks: 0,
    pp3Tasks: 0,
    pp4Tasks: 0,
    pp5Tasks: 0,
    fp1Tasks: 0,
    fp2Tasks: 0,
    fp3Tasks: 0,
    fp4Tasks: 0,
    fp5Tasks: 0,
    balanceTasksTime: "",
    avgTaskTime: "",
    runningTasks: 0,
    missedTasks: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (!response?.ok) {
          const data = await response?.json();
          toast?.error(data?.error);
          setLoading(false);
        } else {
          const stats = await response?.json();
          setAnalytics(stats);
          setLoading(false);
          console.log(stats);
        }
      } catch (error) {
        setLoading(false);
        console.log("error fetching dashboard stats.", error);
        toast.error("Unknown error ocuured");
      }
    };
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-full h-[90vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  } else {
    return analytics?.totalTasks !== 0 ? (
      <div className="w-full max-w-full px-5 pt-5 bg-[white]">
        <div className="flex flex-wrap gap-5 justify-evenly items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col w-48 h-32 bg-[#eeeef9] rounded-xl"
          >
            <h2 className="text-center pt-2 font-medium text-lg">
              Total Tasks
            </h2>
            <p className="size-full grid place-items-center text-xl">
              {analytics?.totalTasks}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col w-48 h-32 bg-[#eeeef9] rounded-xl"
          >
            <h2 className="text-center pt-2 font-medium text-lg">
              Finished Tasks
            </h2>
            <p className="size-full grid place-items-center text-xl">
              {analytics?.totalFinishedTasks}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col w-48 h-32 bg-[#eeeef9] rounded-xl"
          >
            <h2 className="text-center pt-2 font-medium text-lg">
              Pending Tasks
            </h2>
            <p className="size-full grid place-items-center text-xl">
              {analytics?.totalPendingTasks}
            </p>
          </motion.div>
        </div>
        <div className="w-full max-w-full flex flex-wrap items-center justify-around py-5 sm:gap-2 gap-2 mt-5">
          <div className="w-full max-w-md sm:max-w-96 md:max-w-56 lg:max-w-72 xl:max-w-96 flex flex-wrap bg-[#eeeef9] p-3 rounded-xl">
            <h1 className="text-center w-full font-semibold text-lg">
              Total Tasks
            </h1>
            <PriorityDoughnutChart
              priorities={{
                P1: analytics?.p1Tasks,
                P2: analytics?.p2Tasks,
                P3: analytics?.p3Tasks,
                P4: analytics?.p4Tasks,
                P5: analytics?.p5Tasks,
              }}
            />
          </div>
          <div className="w-full max-w-md sm:max-w-96 md:max-w-56 lg:max-w-72 xl:max-w-96 flex flex-wrap bg-[#eeeef9] p-3 rounded-xl">
            <h1 className="text-center w-full font-semibold text-lg">
              Finished Tasks
            </h1>
            <PriorityDoughnutChart
              priorities={{
                P1: analytics?.fp1Tasks,
                P2: analytics?.fp2Tasks,
                P3: analytics?.fp3Tasks,
                P4: analytics?.fp4Tasks,
                P5: analytics?.fp5Tasks,
              }}
            />
          </div>
          <div className="w-full max-w-md sm:max-w-96 md:max-w-56 lg:max-w-72 xl:max-w-96 flex flex-wrap bg-[#eeeef9] p-3 rounded-xl">
            <h1 className="text-center w-full font-semibold text-lg">
              Pending Tasks
            </h1>
            <PriorityDoughnutChart
              priorities={{
                P1: analytics?.pp1Tasks,
                P2: analytics?.pp2Tasks,
                P3: analytics?.pp3Tasks,
                P4: analytics?.pp4Tasks,
                P5: analytics?.pp5Tasks,
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-10 md:gap-28 lg:gap-52 items-center justify-center py-5">
          <div className="flex flex-col">
            <p className="text-center font-medium text-lg p-2 flex gap-2 items-center">
              Avg time for a task
              <Tooltip
                color="a855f7"
                title={
                  <span style={{ fontSize: "14px", color: "#efefef" }}>
                    Average time taken to finish a task.
                  </span>
                }
                placement="top"
                arrow
              >
                <IoInformationCircle size={20} />
              </Tooltip>
            </p>
            <div className="size-44 bg-black rounded-full flex items-center justify-center text-base font-medium text-[#eeeef9]">
              {analytics?.avgTaskTime}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-center font-medium text-lg p-2 flex gap-2 items-center">
              On going tasks
              <Tooltip
                color="a855f7"
                title={
                  <span style={{ fontSize: "14px", color: "#efefef" }}>
                    Presently ongoing tasks.
                  </span>
                }
                placement="top"
                arrow
              >
                <IoInformationCircle size={20} />
              </Tooltip>
            </p>
            <div className="size-44 bg-black rounded-full flex items-center justify-center text-base font-medium text-[#eeeef9]">
              {analytics?.runningTasks}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-center font-medium text-lg p-2 flex gap-2 items-center">
              Balance time{" "}
              <Tooltip
                color="a855f7"
                title={
                  <span style={{ fontSize: "14px", color: "#efefef" }}>
                    Time left to complete ongoing task(s).
                  </span>
                }
                placement="top"
                arrow
              >
                <IoInformationCircle size={20} />
              </Tooltip>
            </p>
            <div className="size-44 bg-black rounded-full flex items-center justify-center text-base font-medium text-[#eeeef9]">
              {analytics?.balanceTasksTime}
            </div>
          </div>
        </div>
        <div className="w-full max-w-full px-1 py-5 flex flex-wrap justify-center">
          <div className="min-w-36 flex gap-3 bg-red-600 px-3 py-2 text-slate-50 rounded-lg">
            <p>Missed tasks</p>
            <span>{analytics?.missedTasks}</span>
          </div>
        </div>
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-full h-[90vh] flex items-center justify-center"
      >
        <NotFound title="No tasks found" desc="Add tasks to view analytics" />
      </motion.div>
    );
  }
}
