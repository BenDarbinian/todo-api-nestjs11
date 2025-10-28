import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './interfaces/create-user.input.interface';
import { HashService } from '../../common/hash/hash.service';
import { ValidatePasswordInput } from './interfaces/validate-password.input.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(data: CreateUserInput) {
    if (await this.existsBy('email', data.email)) {
      throw new BadRequestException(
        `User with email "${data.email}" already exists.`,
      );
    }

    const user: User = new User();

    user.name = data.name;
    user.email = data.email;
    user.passwordHash = await this.hashService.hash(data.password);
    user.passwordChangedAt = new Date();

    return user;
  }

  private async findOneBy<K extends keyof User>(
    field: K,
    value: User[K],
    relations?: string[],
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { [field]: value },
      relations,
    });
  }

  public async findOneById(
    id: number,
    relations?: string[],
  ): Promise<User | null> {
    return this.findOneBy('id', id, relations);
  }

  public async findOneByEmail(
    email: string,
    relations?: string[],
  ): Promise<User | null> {
    return this.findOneBy('email', email, relations);
  }

  private async existsBy<K extends keyof User>(
    field: K,
    value: User[K],
    id?: number,
  ): Promise<boolean> {
    const where: FindOptionsWhere<User> = { [field]: value };

    if (id) {
      where.id = Not(id); // Exclude the user with this ID from the check
    }

    return this.userRepository.exists({ where });
  }

  updateName(user: User, name: string): void {
    user.name = name;
  }

  async updateEmail(user: User, email: string): Promise<void> {
    if (
      user.email !== email &&
      (await this.existsBy('email', email, user.id))
    ) {
      throw new BadRequestException(
        `User with email "${email}" already exists.`,
      );
    }

    user.email = email;
  }

  async validatePassword(
    user: User,
    data: ValidatePasswordInput,
  ): Promise<void> {
    const isOldPasswordCorrect = await this.hashService.compare(
      data.oldPassword,
      user.passwordHash,
    );

    if (data.oldPassword === data.newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password.',
      );
    }

    if (!isOldPasswordCorrect) {
      throw new BadRequestException(
        'The old password you entered is incorrect.',
      );
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match.',
      );
    }
  }

  async changePassword(user: User, newPassword: string): Promise<void> {
    user.passwordHash = await this.hashService.hash(newPassword);
    user.passwordChangedAt = new Date();
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
