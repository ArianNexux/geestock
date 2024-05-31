import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    numberPr: z.string().nonempty(REQUIRED_FIELD),
    container: z.object({
        label: z.string(),
        value: z.string()
    }),
    containerDestiny: z.object({
        label: z.string(),
        value: z.string()
    }),

})


export const InputSearchSchema = z.object({

    search: z.object({
        label: z.string(),
        value: z.string()
    }).optional(),


})