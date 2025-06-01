import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from "@/utils/prismaClient";
import bcrypt from 'bcrypt'
import { jwtSignin } from "@/utils/jwt";
import { userType } from '@/utils/Interfaces';




export async function POST(req: NextRequest){
    const { email, password } = await req.json();
    if(!email || !password){
        return NextResponse.json({error: "Email and password are required"}, {status: 400});
    }

    try{
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if(existingUser){
            return NextResponse.json({error: "User already exists"},{status: 400})
        }

        if(password.length < 6){
            return NextResponse.json({error: "Password must be at least 6 characters long"},{status: 400});
        }

        const hashedPassword = await bcrypt.hash(password,12); 

        const newUser = await prisma.user.create({
            data:{
                email,
                password: hashedPassword,
            },
        });

        const token = await jwtSignin({email: newUser.email, id: newUser.id});

        const {password: userPassword,id: userId,email: userEmail,name: userName, ...remainingUser} = newUser;

        if(!remainingUser){
            console.log('no error')
        }

        const user: userType = {userId, userEmail, userName};

        const response = NextResponse.json({message: `New user ${user.userEmail} created.`,user,token},{status: 201});

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
        return NextResponse.json({error: "Something went wrong creating user"}, {status: 500});
    }
}