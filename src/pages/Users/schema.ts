import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    company: z.string().nonempty(REQUIRED_FIELD),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email("Email invalido").nonempty(REQUIRED_FIELD),
    warehouseId: z.object({
        label: z.string(),
        value: z.string()
    }).array().optional(),
    position: z.object({
        label: z.string(),
        value: z.string()
    }),
})