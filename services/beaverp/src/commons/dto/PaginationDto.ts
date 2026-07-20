export class PaginationDto {
  readonly page: number = 1;
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
