import { priorityValues } from "@/utils/helpers";
import { dashboardStats } from "@/utils/Interfaces";
import prisma from "@/utils/prismaClient";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import duration from "dayjs/plugin/duration";
import { cookies } from "next/headers";
dayjs.extend(duration);

export async function GET(){
    try {
        const allCookies = await cookies();
        const userCookie = allCookies.get('user')?.value;
        if(!userCookie){
            return NextResponse.json({error: "Unauthorized: No user found."},{status: 401});
        }
        const user = JSON.parse(userCookie);
        const userId = user?.userId;
        if(!userId){
            return NextResponse.json({error: "No user found."},{status: 400});
        }

        const userWithTasks = await prisma.user.findUnique({where: {id: userId},include: {tasks: true}});
        const userTasks = userWithTasks?.tasks;
        if(!userTasks || userTasks?.length === 0){
            return NextResponse.json({error: "Add tasks to view stats."},{status: 400});
        }
        const p1_tasks = userTasks?.filter((task)=> priorityValues(task?.priority) === 1)
        const p2_tasks = userTasks?.filter((task)=> priorityValues(task?.priority) === 2)
        const p3_tasks = userTasks?.filter((task)=> priorityValues(task?.priority) === 3)
        const p4_tasks = userTasks?.filter((task)=> priorityValues(task?.priority) === 4)
        const p5_tasks = userTasks?.filter((task)=> priorityValues(task?.priority) === 5)
        const finishedTasks = userTasks?.filter((task)=> task?.status === "finished");
        const pendingTasks = userTasks?.filter((task)=> task?.status === "pending");
        const fp1_tasks = finishedTasks?.filter((task)=> priorityValues(task?.priority) === 1);
        const fp2_tasks = finishedTasks?.filter((task)=> priorityValues(task?.priority) === 2);
        const fp3_tasks = finishedTasks?.filter((task)=> priorityValues(task?.priority) === 3);
        const fp4_tasks = finishedTasks?.filter((task)=> priorityValues(task?.priority) === 4);
        const fp5_tasks = finishedTasks?.filter((task)=> priorityValues(task?.priority) === 5);
        const pp1_tasks = pendingTasks?.filter((task)=> priorityValues(task?.priority) === 1);
        const pp2_tasks = pendingTasks?.filter((task)=> priorityValues(task?.priority) === 2);
        const pp3_tasks = pendingTasks?.filter((task)=> priorityValues(task?.priority) === 3);
        const pp4_tasks = pendingTasks?.filter((task)=> priorityValues(task?.priority) === 4);
        const pp5_tasks = pendingTasks?.filter((task)=> priorityValues(task?.priority) === 5);
        let tt_taken = 0;
        const total_finished_tasks = finishedTasks?.length as number;
        let selectedFinshedTasks = 0;
        finishedTasks?.map((task)=>{
            if((task?.start && task?.end) && (dayjs(task?.end).isAfter(dayjs(task?.start))))
            {
                selectedFinshedTasks++;
                const taskEnd = dayjs(task?.end);
                const taskStart = dayjs(task?.start);
                const time_diff = taskEnd.diff(taskStart);
                const time_in_hrs = parseFloat((time_diff/(1000*60*60)).toFixed(1));
                tt_taken += time_in_hrs;
            }
        });

        const avgTime = tt_taken/selectedFinshedTasks || 0;

        let ongoing_tasks = 0;
        let balanceTime = 0;
        let missed_tasks = 0;
        pendingTasks?.map((task)=>{
            if(task?.start){
                const taskStartTime = dayjs(task?.start);
                const taskEndTime = dayjs(task?.end);
                const todayTime = dayjs();
                if(taskStartTime.isBefore(todayTime) && taskEndTime?.isAfter(todayTime)){
                    ongoing_tasks++;
                }

            }
            if(task?.end){
                const task_endTime = dayjs(task?.end);
                const todayTime = dayjs();
                if(task_endTime.isBefore(todayTime)){
                    missed_tasks++;
                }
            }
            if(task?.start && task?.end){
                const taskStartTime = dayjs(task?.start);
                const today = dayjs();
                const task_end_time = dayjs(task?.end);
                if(taskStartTime.isBefore(today) && task_end_time.isAfter(today)){
                    const balanceInms = task_end_time.diff(today);
                    const balanceInh = balanceInms/(1000*60*60);
                    balanceTime +=balanceInh;
                }
            }
        });
        const total_pending_tasks = pendingTasks?.length as number;

        const dashboardStats: dashboardStats = {
            totalTasks: userTasks?.length || 0,
            totalPendingTasks: total_pending_tasks,
            totalFinishedTasks: total_finished_tasks,
            p1Tasks: p1_tasks?.length || 0,
            p2Tasks: p2_tasks?.length || 0,
            p3Tasks: p3_tasks?.length || 0,
            p4Tasks: p4_tasks?.length || 0,
            p5Tasks: p5_tasks?.length || 0,
            pp1Tasks: pp1_tasks?.length || 0,
            pp2Tasks: pp2_tasks?.length || 0,
            pp3Tasks: pp3_tasks?.length || 0,
            pp4Tasks: pp4_tasks?.length || 0,
            pp5Tasks: pp5_tasks?.length || 0,
            fp1Tasks: fp1_tasks?.length || 0,   
            fp2Tasks: fp2_tasks?.length || 0,
            fp3Tasks: fp3_tasks?.length || 0,
            fp4Tasks: fp4_tasks?.length || 0,
            fp5Tasks: fp5_tasks?.length || 0,
            balanceTasksTime: dayjs.duration(balanceTime * 60 * 60 * 1000).format("Y [y] D [d] H [h] m [m]"),
            avgTaskTime: dayjs.duration(avgTime * 60 * 60 * 1000).format("D [d] H [h] m [m]"),
            runningTasks: ongoing_tasks,
            missedTasks: missed_tasks,
        }

        return NextResponse.json(dashboardStats,{status: 200});

    } catch (error) {
        return NextResponse.json({error: "Error getting details..."},{status:500})
    }
}