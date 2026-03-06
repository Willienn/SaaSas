import { Test, TestingModule } from "@nestjs/testing";
import { ordersController } from "../orders.controller";
import { ordersService } from "../orders.service";

describe("ordersController", () => {
  let controller: ordersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ordersController],
      providers: [ordersService],
    }).compile();

    controller = module.get<ordersController>(ordersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
