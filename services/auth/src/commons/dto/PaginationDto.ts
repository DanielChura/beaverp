import { IsOptional, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly page: number = 1;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
