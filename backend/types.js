import z from "zod";

export const signupSchema = z.object({
    username: z.string().email(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})

export const signinSchema = z.object({
    username: z.string().email(),
    password: z.string(),
})

export const updatedSchema = z.object({
    password: z.string().optional(),
    lastname: z.string().optional(),
    firstname: z.string().optional()

})