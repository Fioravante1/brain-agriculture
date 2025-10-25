import { z } from 'zod';

export const harvestFormSchema = z.object({
  name: z.string().min(1, 'Nome da safra é obrigatório').max(100, 'Nome muito longo'),
  year: z.number().int().min(2000, 'Ano deve ser maior que 2000').max(2100, 'Ano deve ser menor que 2100'),
});

export type HarvestFormValues = z.infer<typeof harvestFormSchema>;
