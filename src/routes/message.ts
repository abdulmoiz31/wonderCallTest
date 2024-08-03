import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from '@hono/zod-validator'
import { addCommentSchema, createMessageSchema, getMessageSchema, likeMessageSchema } from "../schemas/zod.schema";

const message = new Hono();
const prisma = new PrismaClient();

message.post("/", zValidator('json', createMessageSchema), async (c) => {
    const {userId, content} = await c.req.json();
    try {
        const message = await prisma.message.create({
            data: {
                userId,
                content
            }
        })
        return c.json({message: "Message Created", postId: message?.id});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
});

message.get("/:id", zValidator('param', getMessageSchema), async (c) => {
    const id = await c.req.param("id") as string;
    const mesageId = parseInt(id);
    try {
        const message = await prisma.message.findUnique({
            where:{
                id: mesageId
            },
            include: {
                likes: true
            }
        });
        return c.json({message});
        // we can let the likes be an array as it is or we can take its length and send it as an integer in response
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

message.post("/like", zValidator('json', likeMessageSchema), async (c) => {
    const {userId, messageId} = await c.req.json();
    try {
        const messageLike = await prisma.messageLike.create({
            data: {
                userId,
                messageId
            }
        })
        return c.json({message: "Message Liked"});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

message.post("/:id/comment", zValidator('json', addCommentSchema), zValidator('param', getMessageSchema), async (c) => {
    const {userId, content} = await c.req.json();
    const id = await c.req.param("id") as string;
    const messageId = parseInt(id);
    try {
        const comment = await prisma.comment.create({
            data: {
                userId,
                content,
                messageId
            }
        })
        return c.json({message: "Comment Added"});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

message.get("/:id/comments", zValidator('param', getMessageSchema), async (c) => {
    const id = await c.req.param("id") as string;
    const messageId = parseInt(id);
    try {
        const comments = await prisma.comment.findMany({
            where:{
                messageId
            }
        })
        return c.json({comments});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

message.delete("/comment/:id", zValidator('param', getMessageSchema), async (c) => {
    const id = await c.req.param("id") as string;
    const commentId = parseInt(id);
    try {
        const comment = await prisma.comment.delete({
            where:{
                id: commentId
            }
        })
        return c.json({message: "Comment Deleted"});
    } catch (error) {
        throw new HTTPException(400, {message: "Bad Request", cause: error});
    }
})

export default message;