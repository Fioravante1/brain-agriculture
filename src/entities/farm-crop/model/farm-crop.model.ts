/**
 * Associação entre fazenda, cultura e safra
 */
export interface FarmCrop {
  id: string;
  farmId: string;
  cropId: string;
  harvestId: string;
  createdAt: Date;
  updatedAt: Date;
  farm: {
    id: string;
    name: string;
    producer: {
      id: string;
      name: string;
    };
  };
  crop: {
    id: string;
    name: string;
  };
  harvest: {
    id: string;
    name: string;
    year: number;
  };
}

/**
 * DTO para criação/edição de associação
 */
export interface FarmCropFormData {
  farmId: string;
  cropId: string;
  harvestId: string;
}
