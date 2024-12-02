// src/animal/interfaces/animal.interface.ts
export interface AnimalModel {
  id: number;
  name: string;
  dateOfBirth: Date;
  species: string;
  breed: string;
  color: string;
  weight: number;
  ownerId: number;
}
