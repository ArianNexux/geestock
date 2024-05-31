/** eslint-disable */
import { z } from "zod";
import { REQUIRED_FIELD } from "../../../utils/constants";

export const LoginSchema = z.object({
    email: z.string().email("Insira um e-mail valido").nonempty(REQUIRED_FIELD),
    password: z.string().nonempty(REQUIRED_FIELD),

})