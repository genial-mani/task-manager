import { userType } from "@/utils/Interfaces";
import prisma from "@/utils/prismaClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const cookiesList = await cookies();
        // const allCookies = cookiesList.getAll();
        // console.log("All Cookies:", allCookies);
        const payloadCookie = cookiesList.get("user");
        if (!payloadCookie) {
            return NextResponse.json(
                { message: "Unauthorized: Payload header is missing." },
                { status: 401 }
            );
        }

        const user: userType = JSON.parse(payloadCookie?.value);
        // console.log("User:", user);

        if (!user || !user?.userId) {
            console.error("Invalid user object in cookie:", payloadCookie.value);
            return NextResponse.json(
              { message: "Invalid user data in cookie." },
              { status: 400 }
            );
          }

        const userWithTasks = await prisma.user.findUnique({
            where: {id: user?.userId},
            include:{tasks: {
                orderBy: {createdAt: 'desc'}
            }},
        });
        const userWithCompletedTasks = await prisma.user.findUnique({
            where: {id: user?.userId},
            include:{tasks: {
                where: {status: "finished"},
                orderBy: {createdAt: 'desc'}
            }},
        });
        if (!userWithTasks || !userWithTasks?.tasks || userWithTasks?.tasks.length === 0) {
            return NextResponse.json({ message: "No tasks found." }, { status: 400 });
        }
        // console.log(userWithTasks);
        const pendingTasks = userWithTasks?.tasks;
        const completedTasks = userWithCompletedTasks?.tasks;
        return NextResponse.json({pendingTasks,completedTasks}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error fetching tasks." }, { status: 500 });
    }
};


export async function POST(req: NextRequest){
    try {
        const { title, desc="", status="pending", priority="FIVE", start=null,end=null} = await req.json();
        // console.log("post 2")
        // console.log("title:", title);
        // console.log("desc:", desc);
        // console.log("status:", status);
        // console.log("pri:", priority);
        // console.log("satrt:", start);
        // console.log("end:", end);
        const trimmedTitle = title?.trim();
        const trimmedDesc = desc?.trim();

    if(!trimmedTitle || trimmedTitle === "") {
        return NextResponse.json({error: 'Title is required.'},{status: 400});
    }

    const cookiesList = await cookies();

        // const allCookies = cookiesList.getAll();
        // console.log("All Cookies:", allCookies);
        const payloadCookie = cookiesList.get("user");

        if (!payloadCookie) {
            return NextResponse.json(
                { error: "Unauthorized: Payload header is missing." },
                { status: 401 }
            );
        }

        const user: userType = JSON.parse(payloadCookie?.value);
        // console.log("User:", user);


        if (!user || !user?.userId) {
            console.error("Invalid user object in cookie:", payloadCookie.value);
            return NextResponse.json(
              { error: "Invalid user data in cookie." },
              { status: 400 }
            );
          }

    const userId = user?.userId;

//     console.log("Before task creation - start:", start);
// console.log("Before task creation - end:", end);

    const task = await prisma.task.create({
        data:{
            title: trimmedTitle,
            desc: trimmedDesc,
            status,
            priority,
            start,
            end,
            userId,
        }
    });


    return NextResponse.json({task,message: "Task added."},{status: 201});
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Error while adding a task try again."},{status: 500})
    }
}

