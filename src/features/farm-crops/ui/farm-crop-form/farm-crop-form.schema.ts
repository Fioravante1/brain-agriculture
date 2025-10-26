import { z } from 'zod';

export const farmCropFormSchema = z.object({
  farmId: z.string().min(1, 'Fazenda é obrigatória'),
  cropId: z.string().min(1, 'Cultura é obrigatória'),
  harvestId: z.string().min(1, 'Safra é obrigatória'),
});

export type FarmCropFormValues = z.infer<typeof farmCropFormSchema>;
