import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValid, parse } from 'date-fns';

export function IsDateOnly(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateOnlyConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
@Injectable()
export class IsDateOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(value)) {
      return false;
    }

    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());

    return isValid(parsedDate);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid date in the format YYYY-MM-DD`;
  }
}
