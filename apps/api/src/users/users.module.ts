import { Module } from "@nestjs/common";
import { UsersRouter } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService, UsersRouter],
})
export class UsersModule {}
