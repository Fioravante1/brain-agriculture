import { z } from 'zod';

export const cropFormSchema = z.object({
  name: z.string().min(3, 'Nome da cultura deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
});

export type CropFormValues = z.infer<typeof cropFormSchema>;
