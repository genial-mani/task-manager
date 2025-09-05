import prisma from "@/utils/prismaClient";
import { cookies } from "next/headers";
import {NextResponse, type NextRequest} from "next/server";


export async function GET(req: NextRequest ) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user');
        const user = userCookie ? JSON.parse(userCookie.value) : null;
        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const userId = user?.userId;
        if(!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const categories = await prisma.category.findMany({where: {userId}});
        if(!categories) {
            return NextResponse.json({message: "No categories found"}, {status: 404})
        }
        return NextResponse.json(categories, {status: 200})
    }catch (error) {
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}