import { z } from "zod";
import { REQUIRED_FIELD } from "../../utils/constants";

export const SupplierSchema = z.object({
    name: z.string().nonempty(REQUIRED_FIELD),
    code: z.string().nonempty(REQUIRED_FIELD),
})