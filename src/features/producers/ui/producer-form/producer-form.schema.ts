import { z } from 'zod';
import { validateCPFOrCNPJ } from '@/shared/lib/utils';

export const producerFormSchema = z.object({
  cpfCnpj: z
    .string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .refine((value) => validateCPFOrCNPJ(value), {
      message: 'CPF/CNPJ inválido',
    }),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
});

export type ProducerFormValues = z.infer<typeof producerFormSchema>;
