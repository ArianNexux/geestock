import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    description: z.string().optional(),
    brand_name: z.string().optional(),
    partNumber: z.string().nonempty(REQUIRED_FIELD),
    min: z.string().optional(),
    target: z.string().optional(),
    location: z.string().optional(),
    supplierId: z.object({
        label: z.string(),
        value: z.string()
    }).optional(),
    categoryId: z.object({
        label: z.string(),
        value: z.string()
    }),
    subCategoryId: z.object({
        label: z.string(),
        value: z.string()
    }),

})