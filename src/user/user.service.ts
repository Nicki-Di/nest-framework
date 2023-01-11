import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PartialUser, User } from './entities';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: User) {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      const user = await this.prismaService.user.create({ data });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException(`Duplication in ${error.meta.target}`);
      }
      throw error;
    }
  }

  async findOne({ username }: PartialUser) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new ForbiddenException('No such user');
    }
    return user;
  }
}