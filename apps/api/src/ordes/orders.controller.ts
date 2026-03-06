import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UpdateOrderDto } from "src/ordes/dto/update-order.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller({ path: "orders", version: "1" })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrdeDto: CreateOrderDto) {
    return this.ordersService.create(createOrdeDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrdeDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrdeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }
}
