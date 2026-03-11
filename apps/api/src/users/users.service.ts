import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoServerError } from "mongodb";
import { Model } from "mongoose";
import { PaginationDto } from "src/users/dto/pagination.dto";
import { User } from "src/users/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      });
      return await createdUser.save();
    } catch (error: unknown) {
      if (
        error instanceof MongoServerError &&
        error?.code === 11000 &&
        error?.keyPattern?.email
      ) {
        throw new ConflictException("Email already exists");
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const users = await this.userModel
      .find()
      .skip(((paginationDto.page || 1) - 1) * (paginationDto.limit || 10))
      .limit(paginationDto.limit || 10)
      .exec();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    return user;
  }
}
