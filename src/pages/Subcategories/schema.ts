import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    email: z.string().email("Email invalido").nonempty(REQUIRED_FIELD),
    role: z.object({
        label: z.string(),
        value: z.number()
    })
})