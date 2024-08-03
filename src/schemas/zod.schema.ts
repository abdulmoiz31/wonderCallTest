import { z } from 'zod'

export const createMessageSchema = z.object({
    userId: z.number().int(),
    content: z.string().min(1).max(200) // max chars constraint
})

export const getMessageSchema = z.object({
    id: z.string().min(1),
})

export const likeMessageSchema = z.object({
    userId: z.number().int(),
    messageId: z.number().int(),
})

export const addCommentSchema = z.object({
    userId: z.number().int(),
    content: z.string().min(1).max(200) 
})

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32) // password length constraint
})