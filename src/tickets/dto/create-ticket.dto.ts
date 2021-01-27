import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  readonly from: string;

  @IsString()
  readonly to: string;

  @IsNumber()
  readonly price: number;

  @IsDate()
  readonly date: Date;
}
