import prisma from "@/utils/prismaClient";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server'
import type { NextRequest  } from 'next/server'



export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }){
    try {
        const allCookies = await cookies();
        const userCookie = allCookies.get('user')?.value;
        console.log("user cookie in get:",userCookie);
        if(!userCookie){
            return NextResponse.json({error: "Unauthorized: No user found."},{status: 401});
        }
        const user = JSON.parse(userCookie);
        const userId = user.userId;
        const { id } = (await params); // giving error if not used await and req (params should be awaited before it is used)
        if(!id){
            return NextResponse.json({error: "No task id."},{status: 400})
        }
        const task = await prisma.task.findUnique({where: {id: id}});
        if(!task){
            return NextResponse.json({error: "No task found."},{status: 404})
        }
        if(task?.userId !== userId){
            return NextResponse.json({error: "Unauthorized action not allowed."},{status: 401});
        }
        return NextResponse.json(task,{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error fetching task."},{status: 500})
    }
}


export async function PATCH(req: NextRequest,{ params } : { params: Promise<{ id: string }>}){
    try {
        const allCookies = await cookies();
        const userCookie = allCookies.get('user')?.value;
        // console.log("user cookie in patch:",userCookie);
        if(!userCookie){
            return NextResponse.json({message: "Unauthorized: No user found."},{status: 401});
        }
        const user = JSON.parse(userCookie);
        const userId = user.userId;
    const {id} = (await params);
    if(!id){
        return NextResponse.json({message: "No task id."},{status: 400});
    }
    const task = await prisma.task.findUnique({where:{id: id}});
    if(!task){
        return NextResponse.json({message: "No task found to update."},{status: 400});
    }
    if(task?.userId !== userId){
        return NextResponse.json({message: "Unauthorized action not allowed."},{status: 401});
    }
    const updatedTask = await prisma.task.update({
        where: {id: id},
        data: {status: 'finished',end: new Date()},
    }); 
    return NextResponse.json({updatedTask,message: "Task completed."},{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error completing task. Try again."},{status: 500});
    }
}

export async function PUT(req: NextRequest,{ params } : { params: Promise<{ id: string }>}){
    try {
        const allCookies = await cookies();
        const userCookie = allCookies.get('user')?.value;
        // console.log("user cookie in patch:",userCookie);
        if(!userCookie){
            return NextResponse.json({error: "Unauthorized: No user found."},{status: 401});
        }
        const user = JSON.parse(userCookie);
        const userId = user.userId;
        const { title, desc="", status="pending", priority="FIVE", start=null,end=null}  = await req.json();
        if(!title || title.trim() === ""){
            return NextResponse.json({error: "Title required."},{status: 400});
        }
    const {id} = (await params); // must use await otherwise error occurs
    if(!id){
        return NextResponse.json({error: "No task id."},{status: 400});
    }
    const task = await prisma.task.findUnique({where:{id: id}});
    if(!task){
        return NextResponse.json({error: "No task found to update."},{status: 400});
    }
    if(task?.userId !== userId){
        return NextResponse.json({error: "Unauthorized action not allowed. Login again"},{status: 401});
    }
    const updatedTask = await prisma.task.update({
        where: {id: id},
        data: {
            title,desc,status,priority,start,end,
        },
    });
    return NextResponse.json({updatedTask,message: "Task updated."},{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error updating task. Try again."},{status: 500});
    }
}

export async function DELETE(req: NextRequest,{ params } : { params: Promise<{ id: string }>}){
    try {
        const allCookies = await cookies();
        const userCookie = allCookies.get('user')?.value;
        if(!userCookie){
            return NextResponse.json({error: "Unauthorized: No user found."},{status: 401});
        }
        const user = JSON.parse(userCookie);
        const userId = user?.userId;
    const {id} = (await params);
    if(!id){
        return NextResponse.json({error: "No task id."},{status: 400});
    }
    const task = await prisma.task.findUnique({where:{id: id}});
    if(!task){
        return NextResponse.json({error: "No task found to delete."},{status: 400});
    }
    if(task?.userId !== userId){
        return NextResponse.json({error: "Unauthorized action not allowed."},{status: 401});
    }
    const deletedTask = await prisma.task.delete({where: {id: id}});
    if(!deletedTask){
        return NextResponse.json({error: "Error deleting task. Try again."},{status: 400});
    }
    return NextResponse.json({message: "Task deleted successfully."},{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error deleting task."},{status: 500});
    }
}
