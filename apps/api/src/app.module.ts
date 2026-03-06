import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrdersModule } from "src/ordes/orders.module";
import { UsersModule } from "./users/users.module";

const mongoUri =
  process.env.MONGO_URI ??
  "mongodb://root:rootpass@localhost:27017/app?authSource=admin";

@Module({
  imports: [UsersModule, OrdersModule, MongooseModule.forRoot(mongoUri)],
  controllers: [],
  providers: [],
})
export class AppModule {}
