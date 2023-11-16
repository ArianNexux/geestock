import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    position: z.string().nonempty(REQUIRED_FIELD),
    company: z.string().nonempty(REQUIRED_FIELD),
    password: z.string().nonempty(REQUIRED_FIELD),
    confirmPassword: z.string().nonempty(REQUIRED_FIELD),
    email: z.string().email("Email invalido").nonempty(REQUIRED_FIELD),

})