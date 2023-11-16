import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const SubcategorySchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    code:z.string().nonempty(REQUIRED_FIELD),
    category: z.object({
        label: z.string(),
        value: z.string()
    })
})