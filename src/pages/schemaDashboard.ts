import { z } from "zod";
import { REQUIRED_FIELD } from "../utils/constants";

export const DashboardSchema = z.object({

    search: z.object({
        label: z.string(),
        value: z.string()
    }).optional(),


})