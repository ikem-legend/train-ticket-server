import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsSumOf } from '../../common/decorators/sum.decorator';

enum TrainClass {
  InterCity = 'InterCity',
  HighSpeed = 'HighSpeed',
  Commuter = 'Commuter',
  Monorail = 'Monorail',
}

export class CreateTrainDto {
  @IsEnum(TrainClass)
  readonly class: string;

  @IsString()
  @MinLength(5, {
    message:
      'Train type is too short. Minimum length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(50, {
    message:
      'Train type is too long. Maximum length is $constraint1 characters, but actual is $value',
  })
  readonly type: string;

  @IsNumber()
  @Min(20, {
    message:
      'Train capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  @IsSumOf('firstClassCapacity', { message: 'Add correct sum' })
  readonly capacity: number;

  // Since most trains have first and economy classes,
  // these should be specified while creating trains
  // TODO: Ensure that both capacities add up to total capacity

  @IsNumber()
  @Min(6, {
    message:
      'Train capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  readonly firstClassCapacity: number;

  @IsNumber()
  @Min(50, {
    message:
      'Train capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  readonly economyClassCapacity: number;

  @IsBoolean()
  readonly enabled: boolean;
}
