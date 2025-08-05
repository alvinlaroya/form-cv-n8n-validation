import { z } from "zod";

export default z.object({
    fullname: z
        .string({
            required_error: "Full name is required",
            invalid_type_error: "Full name must be a string",
        })
        .min(1, { message: "Full name is required" }),

    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .min(1, { message: "Email is required" })
        .email({ message: "Must be a valid email" }),

    phone: z
        .string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string",
        })
        .min(1, { message: "Phone number is required" }),

    skills: z
        .string({
            required_error: "Skills are required",
            invalid_type_error: "Skills must be a string",
        })
        .min(1, { message: "Please enter your skills" }),

    experience: z
        .string({
            required_error: "Experience is required",
            invalid_type_error: "Experience must be a string",
        })
        .min(1, { message: "Please describe your experience" }),

    cv: z
        .any()
        .refine((files) => files?.length == 1, "File is required")
        .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5MB",
        })
        .refine((files) => files?.[0]?.type === "application/pdf", {
            message: "Only PDF files are allowed",
        })
        .transform((files) => files?.[0]),
});