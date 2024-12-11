import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export default class ValidatorsExt {
  static expirationDateValidator(control: AbstractControl<string>): ValidationErrors | null {
    const [month, year] = control.value.split('/').map(v => +v);

    const error = { expiredCard: true };

    const today = new Date();
    const currentYear = today.getFullYear() - 2000;

    if (year < currentYear) {
      return error;
    }

    if (year === currentYear && month - 1 < today.getMonth()) {
      return error;
    }

    return null;
  }

  static validators(required = true, pattern?: RegExp, ...others: ValidatorFn[]): ValidatorFn[] {
    const result: ValidatorFn[] = [];

    if (required) {
      result.push(Validators.required);
    }

    if (pattern) {
      result.push(Validators.pattern(pattern));
    }

    if (others.length > 0) {
      result.push(...others);
    }

    return result;
  }
}
