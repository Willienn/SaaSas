import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "src/ordes/orders.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return "This action adds a new order";
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
