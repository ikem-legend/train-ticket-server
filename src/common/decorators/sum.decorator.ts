import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { CreateTrainDto } from '../../trains/dto/create-train.dto';

// Ensure that decorator property is equal to the sum of the specified properties
export function IsSumOf(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: CreateTrainDto, propertyName: string) {
    registerDecorator({
      name: 'isSumOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: property,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [...relatedPropertyNames] = args.constraints;
          const relatedTotalValue = relatedPropertyNames.reduce(
            (currTotal: number, currVal: string) =>
              currTotal + (args.object as any)[currVal],
            0,
          );
          // Check if value equals both passed in values
          return value === relatedTotalValue;
        },
      },
    });
  };
}
