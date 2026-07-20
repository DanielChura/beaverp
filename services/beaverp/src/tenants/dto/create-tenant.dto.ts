import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  taxId: string;
}
