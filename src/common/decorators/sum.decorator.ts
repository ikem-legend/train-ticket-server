import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSumOf(
  property: string,
  validationOptions?: ValidationOptions,
) {
  console.log({ property });
  return function (object: Object, propertyName: string) {
    // console.log({ object });
    registerDecorator({
      name: 'isSumOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // console.log({ constraints: args.constraints });
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          // Check if value equals both passed in values
          return value === relatedValue;
        },
      },
    });
  };
}
