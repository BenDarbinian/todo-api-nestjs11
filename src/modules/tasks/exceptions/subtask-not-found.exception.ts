import { NotFoundException } from '@nestjs/common';

export class SubtaskNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Subtask with id ${id} not found`);
  }
}
