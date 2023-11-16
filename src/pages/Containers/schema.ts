import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const WarehouseSchemaFixed = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    description: z.string().nonempty(REQUIRED_FIELD),
    code: z.string().nonempty(REQUIRED_FIELD),
    country: z.string().nonempty(REQUIRED_FIELD),
    province: z.string().nonempty(REQUIRED_FIELD),
    address: z.string().nonempty(REQUIRED_FIELD),
    type: z.object({
        value: z.string().nonempty(REQUIRED_FIELD),
        label: z.string().nonempty(REQUIRED_FIELD)
    })
})

export const WarehouseSchemaNonFixed = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    description: z.string().nonempty(REQUIRED_FIELD),
    code: z.string().nonempty(REQUIRED_FIELD),
    company: z.string().nonempty(REQUIRED_FIELD),
    capacity: z.string().nonempty(REQUIRED_FIELD),
    flag: z.string().nonempty(REQUIRED_FIELD),
    type: z.object({
        value: z.string().nonempty(REQUIRED_FIELD),
        label: z.string().nonempty(REQUIRED_FIELD)
    })
})