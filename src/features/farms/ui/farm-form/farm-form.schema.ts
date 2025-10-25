import { z } from 'zod';

export const farmFormSchema = z
  .object({
    producerId: z.string().min(1, 'Produtor é obrigatório'),
    name: z.string().min(3, 'Nome da fazenda deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(50, 'Nome da cidade muito longo'),
    state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres').max(2, 'Estado deve ter 2 caracteres'),
    totalArea: z.number().min(0.01, 'Área total deve ser maior que zero'),
    arableArea: z.number().min(0, 'Área agricultável não pode ser negativa'),
    vegetationArea: z.number().min(0, 'Área de vegetação não pode ser negativa'),
  })
  .refine(
    data => {
      return data.arableArea + data.vegetationArea <= data.totalArea;
    },
    {
      message: 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total',
      path: ['arableArea'],
    },
  );

export type FarmFormValues = z.infer<typeof farmFormSchema>;
