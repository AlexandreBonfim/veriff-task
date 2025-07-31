export class Verification {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
  ) {}

  static create(id: string, createdAt: Date): Verification {
    return new Verification(id, createdAt);
  }
}
