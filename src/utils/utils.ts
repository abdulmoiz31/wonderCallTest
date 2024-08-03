import { sign } from "hono/jwt"
import { JWTPayload } from "hono/utils/jwt/types"

export const generateToken = async (payload: JWTPayload)=>{
    const secret = process.env.JWT_SECRET as string;
    return await sign(payload, secret);
}