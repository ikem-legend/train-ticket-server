import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  readonly origin: string;

  @IsString()
  readonly destination: string;

  @IsNumber()
  readonly price: number;

  @IsDate()
  readonly date: Date;
}
