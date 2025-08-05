import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            fullname: z.string().min(1),
            email: z.string().min(1).email({ message: "Must be a valid email" }),
            phone: z.string().min(1),
            skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
            experience: z.string().min(1),
            cv: z.string().min(1)
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.profile.create({
                data: {
                    name: input.fullname,
                    email: input.email,
                    phone: input.phone,
                    experience: input.experience,
                    skills: {
                        create: input.skills.map(skillName => ({
                            name: skillName
                        }))
                    },
                    cvUrl: input.cv
                },
                include: {
                    skills: true
                }
            });
        })
});
