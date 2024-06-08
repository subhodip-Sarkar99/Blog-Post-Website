import { z } from "zod";

const loginSchema=z.object({
    email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
    password: z
    .string({ required_error: "Password is required" })
    .min(7, { message: "Password must be at least of 6 characters" })
    .max(1024, "Password can't be greater than 1024 characters"),
});

const signUpSchema= loginSchema.extend({
    username: z
    .string({required_error: "Name is required"})
    .trim()
    .min(3,{message: "Name must have atleast 3 characters"})
    .max(255, {message: "Name must not be more than 255 characters"}),
   
});

const updateSchema=z.object({
    email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" })
    .optional(),
    password: z
    .string()
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" })
    .optional(),
    username: z
    .string()
    .trim()
    .min(3,{message: "Name must have atleast 3 characters"})
    .max(255, {message: "Name must not be more than 255 characters"})
    .optional(),
    profilePicture: z.string()
    .optional(),
});

export {loginSchema,signUpSchema,updateSchema};