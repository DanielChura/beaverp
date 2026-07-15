export class ResponseDto<T> {
  public readonly totalPages: number;
  public readonly isFirst: boolean;
  public readonly isLast: boolean;

  constructor(
    public readonly elements: T[],
    public readonly totalElements: number,
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {
    this.totalPages = Math.ceil(totalElements / pageSize);
    this.isFirst = pageNumber === 1;
    this.isLast = pageNumber >= this.totalPages;
  }
}
