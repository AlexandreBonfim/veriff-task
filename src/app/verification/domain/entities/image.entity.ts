export class Image {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
  ) {}

  static create(id: string, createdAt: Date): Image {
    return new Image(id, createdAt);
  }
}
