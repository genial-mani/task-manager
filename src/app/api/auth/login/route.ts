import { userType } from "@/utils/Interfaces";
import { jwtSignin } from "@/utils/jwt";
import prisma from "@/utils/prismaClient";
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function POST(req: NextRequest){
    const { email, password } = await req.json();
    if(!email || !password){
        return NextResponse.json({error: "Email and password are required"}, {status: 400});
    }

    try{
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
 
        if(!existingUser){
            return NextResponse.json({error: "User not found"},{status: 404})  
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if(!passwordMatch){
            return NextResponse.json({error: "Invalid password"},{status: 401});
        }

        const token = await jwtSignin({email: existingUser.email, id: existingUser.id});

        const {password: userPassword,id: userId,email: userEmail,name: userName, ...remainingUser} = existingUser;

        if(!remainingUser){
            console.log('no error')
        }

        const user: userType = {userId, userEmail, userName};

        const response = NextResponse.json({message: `Logged in as ${user.userEmail}`,user,token},{status: 201});

        response.cookies.set(
        'user',
        JSON.stringify(user),
        {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        }
);

        response.cookies.set(
        'token',
        token,
        { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: Number(process.env.JWT_EXPIRES_IN),
        }
    );

        return response;
    }
    catch(error){
        return NextResponse.json({error: "Something went wrong logging user."}, {status: 500});
    }
}