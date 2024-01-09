import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const OrderSchema = z.object({
    description: z.string().nonempty(REQUIRED_FIELD),
    imbl_awb: z.string().nonempty(REQUIRED_FIELD),
    quantity: z.string(),
    partNumber: z.string()
})