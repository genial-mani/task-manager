import prisma from "@/utils/prismaClient";
import { NextResponse, type NextRequest } from "next/server";


export async function GET(req: NextRequest, {params} : {params: Promise<{id: string}>}) {
    try {
        const {id} = (await params);
        if(!id) {
            return NextResponse.json({error: "No category id"}, {status: 400})
        }
        const categorialTasks = await prisma.category.findMany({
            where: {id},
            include: {tasks: true}
        })
        if(!categorialTasks) {
            return NextResponse.json({error: "No tasks found for this category"}, {status: 404})
        }
        const tasks = categorialTasks[0].tasks;
        if(!tasks || tasks.length === 0) {
            return NextResponse.json({error: "No tasks found for this category"}, {status: 404})
        }
        return NextResponse.json(tasks, {status: 200})

    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}