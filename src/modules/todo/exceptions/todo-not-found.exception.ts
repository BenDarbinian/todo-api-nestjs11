import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}
