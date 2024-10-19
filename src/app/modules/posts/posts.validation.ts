import { z } from "zod";

const commentSchema = z.object({
    body: z.object({
        commentText: z.string().min(1, "Comment cannot be empty"),
    })
});

export default commentSchema;

export const postValidationSchema = {
    commentSchema
}