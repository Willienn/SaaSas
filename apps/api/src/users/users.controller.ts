import { Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";
import { createUserContract } from "./user.contract";
import { UsersService } from "./users.service";

const userIdInput = z.object({
  id: z.coerce.number(),
});

const updateUserDataSchema = createUserContract.partial();

const updateUserInput = z.object({
  id: z.coerce.number(),
  data: updateUserDataSchema,
});

@Router({ alias: "users" })
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({
    input: createUserContract,
    output: z.string(),
  })
  create(@Input() createUserDto: z.infer<typeof createUserContract>) {
    return this.usersService.create(createUserDto);
  }

  @Query({
    output: z.string(),
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Query({
    input: userIdInput,
    output: z.string(),
  })
  findOne(@Input("id") id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation({
    input: updateUserInput,
    output: z.string(),
  })
  update(
    @Input("id") id: number,
    @Input("data") updateUserDto: z.infer<typeof updateUserDataSchema>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation({
    input: userIdInput,
    output: z.string(),
  })
  remove(@Input("id") id: number) {
    return this.usersService.remove(id);
  }
}
