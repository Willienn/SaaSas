import { Test, TestingModule } from "@nestjs/testing";
import { UsersRouter } from "../users.controller";
import { UsersService } from "../users.service";

describe("UsersRouter", () => {
  let router: UsersRouter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRouter],
    }).compile();

    router = module.get<UsersRouter>(UsersRouter);
  });

  it("should be defined", () => {
    expect(router).toBeDefined();
  });
});
