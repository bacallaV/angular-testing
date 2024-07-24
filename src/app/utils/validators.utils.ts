import { AbstractControl } from '@angular/forms';
import { UserService } from '@core/services';
import { debounceTime, map, Observable, switchMap, take } from 'rxjs';

export class MyValidators {

  public static isPriceValid(control: AbstractControl): {
    price_invalid: boolean;
  } | null {
    const value = control.value;
    if (value > 10000) {
      return {price_invalid: true};
    }
    return null;
  }

  public static validPassword(control: AbstractControl): {
    invalid_password: boolean;
  } | null {
    const value = control.value;
    if (!containsNumber(value)) {
      return {invalid_password: true};
    }
    return null;
  }

  public static matchPasswords(control: AbstractControl): {
    match_password: boolean;
  } | null {
    const passwordField = control?.get('password');
    const confirmPasswordField = control?.get('confirmPassword');

    if(!passwordField || !confirmPasswordField)
      throw new Error('some of the fileds were not found: password | confirmPassword');

    if (passwordField.value !== confirmPasswordField.value) return {
      match_password: true
    };

    return null;
  }

  public static validateEmailAvailability(userService: UserService): (control: AbstractControl) => Observable<{
    not_available: boolean;
  } | null> {
    return (control: AbstractControl) => {
      return control.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((email: string) => userService.checkEmailAvailability(email)),
        map((response) => {
          if (!response.isAvailable) return {
            not_available: true,
          };

          return null;
        }),
        take(1),
      );
    };
  }

  // static validateCategory(service: CategoriesService) {
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     return service.checkCategory(value)
  //     .pipe(
  //       map((response: any) => {
  //         const isAvailable = response.isAvailable;
  //         if (!isAvailable) {
  //           return {not_available: true};
  //         }
  //         return null;
  //       })
  //     );
  //   };
  // }

}

function containsNumber(value: string): boolean {
  return value.split('').find(v => isNumber(v)) !== undefined;
}

function isNumber(value: string): boolean {
  return !isNaN(parseInt(value, 10));
}
