import { SignJWT, jwtVerify as joseJwtVerify, JWTPayload } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function jwtSignin(payload: JWTPayload): Promise<string> {
    const encoder = new TextEncoder();
    const secret = encoder.encode(JWT_SECRET);

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret);

    return jwt;
}

export async function jwtVerify(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await joseJwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        // console.log("Payload in jwt.ts",payload)
        return payload;
    } catch (error: any) {
        console.error("JWT verification failed:", error);
        return null;
    }
}
