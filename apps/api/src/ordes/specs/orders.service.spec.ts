import { Test, TestingModule } from "@nestjs/testing";
import { ordersService } from "../orders.service";

describe("ordersService", () => {
  let service: ordersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ordersService],
    }).compile();

    service = module.get<ordersService>(ordersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
