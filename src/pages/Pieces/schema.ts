import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const UserSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    description: z.string().nonempty(REQUIRED_FIELD),
    brand_name: z.string().nonempty(REQUIRED_FIELD),
    partNumber: z.string().nonempty(REQUIRED_FIELD),
    quantity: z.string().nonempty(REQUIRED_FIELD),
    min: z.string().nonempty(REQUIRED_FIELD),
    target: z.string().nonempty(REQUIRED_FIELD),
    price: z.string().nonempty(REQUIRED_FIELD),
    locationInWarehouse: z.string().optional(),
    supplierId: z.object({
        label: z.string(),
        value: z.string()
    }),
    state: z.object({
        label: z.string(),
        value: z.string()
    }),

    categoryId: z.object({
        label: z.string(),
        value: z.string()
    }),
    subCategoryId: z.object({
        label: z.string(),
        value: z.string()
    }),

})