import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/user.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch: boolean = await bcrypt.compare(password, user?.passwordHash);
    // this is to prevent user enumeration attack, we don't want to reveal what credentials was wrong
    if (!user || !isMatch) {
      throw new BadRequestException("Invalid credentials");
    }
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    // TODO: add id to user  {sub: user.id}
    const payload = { email: user.email };
    return { access_token: await this.jwtService.sign(payload) };
  }

  async register(user: CreateUserDto): Promise<{ access_token: string }> {
    if (await this.userService.findOneByEmail(user.email)) {
      throw new BadRequestException("User already exists");
    }
    const newUser = await this.userService.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return this.login(newUser);
  }
}
