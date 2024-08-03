import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import message from "./message";
import { HTTPException } from "hono/http-exception";
import { generateToken } from "../utils/utils";
import { signupSchema } from "../schemas/zod.schema";
import { zValidator } from "@hono/zod-validator";
import { decode } from "hono/jwt";

const user = new Hono();
const prisma = new PrismaClient();

user.post("/signup", zValidator('json', signupSchema), async (c) => {
    const {email, password} = await c.req.json();
    const encryptedPassword = await generateToken({sub: password});
    try {
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: encryptedPassword
            }
        });
        return c.json({message: "User Created", userId: user?.id});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

user.post("/login", zValidator('json', signupSchema), async (c) => {
    const {email, password} = await c.req.json();
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                email
            }
        });
    } catch (error) {
        throw new HTTPException(400, {message: "Email Not Registered", cause: error});
    }
    const { header, payload } = decode(user?.passwordHash as string)
    if (payload?.sub !== password) {
        throw new HTTPException(400, {message: "Incorrect Password"});
    }
    const token = await generateToken({sub: user?.id, exp: Math.floor(Date.now() / 1000) + 60 * 30})
    return c.json({message: "Logged In", token: token})
})
//added zod validators to ensure availability of email and password
export default user;