import { Injectable } from "@nestjs/common";
import { z } from "zod";
import { createUserContract } from "./user.contract";

@Injectable()
export class UsersService {
  create(createUserDto: z.infer<typeof createUserContract>) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(
    id: number,
    updateUserDto: Partial<z.infer<typeof createUserContract>>,
  ) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
