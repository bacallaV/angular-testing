import { FormControl, FormGroup } from '@angular/forms';
import { MyValidators } from './validators.utils';
import { UserService } from '@core/services';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

fdescribe('MyValidators', () => {
  describe('#isPriceValid', () => {
    it('should return null', () => {
      const formControl1 = new FormControl(10000);
      const formControl2 = new FormControl(0);
      const formControl3 = new FormControl(-10000);

      const validationRes1 = MyValidators.isPriceValid(formControl1);
      const validationRes2 = MyValidators.isPriceValid(formControl2);
      const validationRes3 = MyValidators.isPriceValid(formControl3);

      expect(validationRes1).toBeNull();
      expect(validationRes2).toBeNull();
      expect(validationRes3).toBeNull();
    });

    it('should return validation error', () => {
      const formControl = new FormControl(10001);

      const validationRes = MyValidators.isPriceValid(formControl);

      expect(validationRes?.price_invalid).toBeTrue();
    });
  });

  describe('#validPassword', () => {
    it('should return null', () => {
      const formControl = new FormControl('password1');

      const validationRes = MyValidators.validPassword(formControl);

      expect(validationRes).toBeNull();
    });

    it('should return validation error', () => {
      const formControl = new FormControl('password');

      const validationRes = MyValidators.validPassword(formControl);

      expect(validationRes?.invalid_password).toBeTrue();
    });
  });

  describe('#matchPassword', () => {
    it('should return null', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123'),
        confirmPassword: new FormControl('password123'),
      });

      const validationRes = MyValidators.matchPasswords(formGroup);

      expect(validationRes).toBeNull();
    });

    it('should return validation error', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123'),
        confirmPassword: new FormControl('password12'),
      });

      const validationRes = MyValidators.matchPasswords(formGroup);

      expect(validationRes?.match_password).toBeTrue();
    });

    it('should throw error', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123'),
        otherPassword: new FormControl('password123'),
      });

      const fn: () => { match_password: boolean } | null =
        () => MyValidators.matchPasswords(formGroup);

      expect(fn).toThrow(
        new Error('some of the fileds were not found: password | confirmPassword')
      );
    });
  });

  describe('#validateEmailAvailability', () => {
    it('should return null', (doneFn) => {
      const userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('userService', ['checkEmailAvailability']);
      userService.checkEmailAvailability.and.returnValue(
        of({ isAvailable: true })
      );
      const validator = MyValidators.validateEmailAvailability(userService);
      const emailTest = 'test@example.com';
      const formControl = new FormControl('');

      validator(formControl).subscribe({
        next: (validationRes) => {
          expect(validationRes).toBeNull();
          expect(userService.checkEmailAvailability).toHaveBeenCalledOnceWith(emailTest);
          doneFn();
        },
      });

      formControl.setValue(emailTest);
    });

    it('should return validation error', (doneFn) => {
      const userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('userService', ['checkEmailAvailability']);
      userService.checkEmailAvailability.and.returnValue(
        of({ isAvailable: false })
      );
      const validator = MyValidators.validateEmailAvailability(userService);
      const emailTest = 'test@example.com';
      const formControl = new FormControl('');

      validator(formControl).subscribe({
        next: (validationRes) => {
          expect(validationRes?.not_available).toBeTrue();
          expect(userService.checkEmailAvailability).toHaveBeenCalledOnceWith(emailTest);
          doneFn();
        },
      });

      formControl.setValue(emailTest);
    });

    it('should debounce 500ms', fakeAsync(() => {
      const userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('userService', ['checkEmailAvailability']);
      userService.checkEmailAvailability.and.returnValue(
        of({ isAvailable: true })
      );
      const validator = MyValidators.validateEmailAvailability(userService);
      const emailTest = 'test@example.com';
      const formControl = new FormControl('');

      const validator$ = validator(formControl);
      let validationRes: { not_available: boolean } | null | undefined;

      validator$.subscribe({
        next: (res) => {
          validationRes = res;
        },
      });

      formControl.setValue(emailTest);
      tick();
      expect(validationRes).withContext('debounce not fired yet').toBeUndefined();
      expect(userService.checkEmailAvailability)
        .withContext('debounce not fired yet')
        .toHaveBeenCalledTimes(0);

      tick(500);
      expect(validationRes).withContext('debounce fired').toBeNull();
      expect(userService.checkEmailAvailability).withContext('debounce fired').toHaveBeenCalledOnceWith(emailTest);
    }));
  });
});
