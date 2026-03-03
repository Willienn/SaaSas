import { Module } from "@nestjs/common";
import { TRPCModule } from "nestjs-trpc";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: "../../packages/trpc/src/server",
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
