export class User {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly passwordHash: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}
}
