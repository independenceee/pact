import { z } from "zod";

export const UtxoSchema = z.object({
    txHash: z.string(),
    outputIndex: z.number(),
    amount: z.number().positive("Amount must be greater than 0"),
});

export const CommitSchema = z.object({
    selectedUtxo: z.string().refine((val) => {
        if (!val) return false;
        try {
            const parsed = JSON.parse(val);
            UtxoSchema.parse(parsed);
            return true;
        } catch {
            return false;
        }
    }, "Please select a valid ADA amount"),
});

export const ContributeSchema = z.object({
    amount: z.number({ message: "Vui lòng nhập một số hợp lệ" }).min(0, { message: "Số phải lớn hơn hoặc bằng 0" }),
});
