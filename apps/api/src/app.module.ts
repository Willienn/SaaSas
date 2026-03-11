import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtGuard } from "src/auth/jwt.guard";
import { JwtStrategy } from "src/auth/strategy/jwt.strategy";
import { OrdersModule } from "src/ordes/orders.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

const mongoUri =
  process.env.MONGO_URI ??
  "mongodb://root:rootpass@localhost:27017/app?authSource=admin";

@Module({
  imports: [
    UsersModule,
    OrdersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(mongoUri),
  ],
  controllers: [],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
