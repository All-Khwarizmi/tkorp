import { Injectable } from '@nestjs/common';
import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';

@Injectable()
export class AnimalService {
  create(createAnimalInput: CreateAnimalInput) {
    return 'This action adds a new animal';
  }

  findAll() {
    return `This action returns all animal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} animal`;
  }

  update(id: number, updateAnimalInput: UpdateAnimalInput) {
    return `This action updates a #${id} animal`;
  }

  remove(id: number) {
    return `This action removes a #${id} animal`;
  }
}
