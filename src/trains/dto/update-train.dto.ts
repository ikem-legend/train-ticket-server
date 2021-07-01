import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Max,
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

// Train types - CRRC DF11GN, CRRC DF7BN

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

  @IsString()
  @MinLength(3, {
    message:
      'Train ID is too short. Minimum length is $constraint1, but actual value is $value',
  })
  @MaxLength(20, {
    message:
      'Train ID is too long. Maximum length is $constraint1, but actual value is $value',
  })
  readonly customId: string;

  // Since most trains have first, business and economy classes,
  // these should be specified while creating trains

  @IsNumber()
  @Min(10, {
    message:
      'First class capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  @Max(20, {
    message:
      'First class capacity is too large. Maximum capacity is $constraint1, but actual is $value',
  })
  readonly firstClassCapacity: number;

  @IsNumber()
  @Min(20, {
    message:
      'Business class capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  @Max(40, {
    message:
      'Business class capacity is too large. Minimum capacity is $constraint1, but actual is $value',
  })
  readonly businessClassCapacity: number;

  @IsNumber()
  @Min(40, {
    message:
      'Economy capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  @Max(100, {
    message:
      'Train capacity is too large. Minimum capacity is $constraint1, but actual is $value',
  })
  readonly economyClassCapacity: number;

  @IsNumber()
  @Min(70, {
    message:
      'Train capacity is too small. Minimum capacity is $constraint1, but actual is $value',
  })
  @Max(160, {
    message:
      'Train capacity is too large. Maximum capacity is $constraint1, but actual is $value',
  })
  @IsSumOf(
    ['firstClassCapacity', 'businessClassCapacity', 'economyClassCapacity'],
    {
      message:
        'Incorrect sum. Please ensure that total sum is equivalent to the sum of individual capacities',
    },
  )
  readonly capacity: number;

  @IsBoolean()
  readonly enabled: boolean;
}
