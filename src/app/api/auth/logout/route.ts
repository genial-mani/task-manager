import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(){
    try {
        const cookiesStore = await cookies();

        cookiesStore.set(
            {
                name: 'user',
                value: "",
                maxAge: -1,
                httpOnly: false,
            }
        );
        cookiesStore.set(
            {
                name: 'token',
                value: "",
                maxAge: -1,
                httpOnly: true,
            }
        );
        return NextResponse.json({message: "Logged out successfully."},{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Something went wrong while logging out.'},{status: 500})
    }
}