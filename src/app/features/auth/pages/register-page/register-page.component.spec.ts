import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';

import * as Testing from '@testing/index';
import { UserService } from '@core/services';
import { generateOneCustomer } from '@testing/mock';
import { of } from 'rxjs';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['create', 'checkEmailAvailability']);

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    })
    .compileComponents();

    userService.checkEmailAvailability.and.returnValue(
      of({ isAvailable: true }),
    );

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form fields', () => {
    it('should #name field be invalid with UI', () => {
      const inputElement = Testing.queryByCSS(fixture, 'input#name');

      Testing.inputData(fixture, 'input#name', '');
      fixture.detectChanges();

      expect(component.nameField.invalid)
        .withContext('name form field invalid')
        .toBeTruthy();

      const inputErrDE = Testing.queryByCSS(fixture, 'input#name + small');
      expect(inputErrDE).withContext('error displayed in view').toBeFalsy();

      Testing.dispatchEvent(fixture, 'input#name', 'blur');
      fixture.detectChanges();

      const inputErrTextContent = Testing.getTextByCSSQuery(fixture, 'input#name + small');
      expect(inputErrTextContent?.toLocaleLowerCase())
        .withContext('corresponding error in view')
        .toContain('required');
      expect(inputElement.attributes['aria-invalid'])
        .withContext('name input with aria-invalid')
        .toContain('true');
    });

    it('should #email field be invalid with UI', () => {
      const inputElement = Testing.queryByCSS(fixture, 'input#email');

      Testing.inputData(fixture, 'input#email', 'this is an invalid email');
      fixture.detectChanges();

      expect(component.emailField.invalid).withContext('email form field invalid').toBeTruthy();

      const inputErrDE = Testing.queryByCSS(fixture, 'input#email + small');
      expect(inputErrDE).withContext('error displayed in view').toBeFalsy();

      Testing.dispatchEvent(fixture, 'input#email', 'blur');
      fixture.detectChanges();

      const inputErrTextContent = Testing.getTextByCSSQuery(fixture, 'input#email + small');
      expect(inputErrTextContent)
        .withContext('corresponding error in view')
        .toContain('email');
      expect(inputElement.attributes['aria-invalid'])
        .withContext('email input with aria-invalid')
        .toContain('true');
    });

    it('should #email field have unavailable error with UI', fakeAsync(() => {
      userService.checkEmailAvailability.and.returnValue(
        of({ isAvailable: false })
      );
      const testEmail = 'test@example.com';
      const inputElement = Testing.queryByCSS(fixture, 'input#email');

      Testing.inputData(fixture, 'input#email', testEmail);
      fixture.detectChanges();
      tick(500);

      expect(userService.checkEmailAvailability).toHaveBeenCalledOnceWith(testEmail);
      expect(component.emailField.invalid).withContext('email form field invalid').toBeTrue();

      const inputErrDE = Testing.queryByCSS(fixture, 'input#email + small');
      expect(inputErrDE).withContext('error displayed in view').toBeFalsy();

      Testing.dispatchEvent(fixture, 'input#email', 'blur');
      fixture.detectChanges();

      const inputErrTextContent = Testing.getTextByCSSQuery(fixture, 'input#email + small');
      expect(inputErrTextContent)
        .withContext('corresponding error in view')
        .toContain('unavailable');
      expect(inputElement.attributes['aria-invalid'])
        .withContext('email input with aria-invalid')
        .toContain('true');
    }));

    it('should #password field be invalid with UI', () => {
      const inputDE = Testing.queryByCSS(fixture, 'input#password');
      const inputEl: HTMLInputElement = inputDE.nativeElement;

      inputEl.value = '';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.passwordField.invalid).withContext('empty').toBeTruthy();

      expect(inputEl.attributes.getNamedItem('aria-invalid')?.value)
        .withContext('initial aria-invalid state')
        .toBe('');

      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(inputEl.attributes.getNamedItem('aria-invalid')?.value)
        .withContext('empty error with aria-invalid for input')
        .toBe('true');

      inputEl.value = '12345';
      inputEl.dispatchEvent(new Event('input'));
      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.passwordField.invalid).withContext('length less than six').toBeTruthy();
      expect(inputEl.attributes.getNamedItem('aria-invalid')?.value)
        .withContext('length less than six error with aria-invalid for input')
        .toBe('true');

      inputEl.value = 'asdasdasdasdsads';
      inputEl.dispatchEvent(new Event('input'));
      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.passwordField.invalid).withContext('no numbers').toBeTruthy();
      expect(inputEl.attributes.getNamedItem('aria-invalid')?.value)
        .withContext('no numbers error with aria-invalid for input')
        .toBe('true');
    });

    it('should #confirmPassword field be invalid with UI', () => {
      const confirmPassElement: HTMLInputElement = Testing.queryByCSS(fixture, 'input#confirmPassword').nativeElement;

      Testing.inputData(fixture, 'input#password', 'asdf123');
      confirmPassElement.value = 'asdf12';
      confirmPassElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.form.hasError('match_password')).toBeTruthy();

      const confirmPasswordErrorElement = Testing.queryByCSS(fixture, 'input#confirmPassword + small');
      expect(confirmPasswordErrorElement).toBeFalsy();

      confirmPassElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const confirmPasswordErrorMessage =
        Testing.getTextByCSSQuery(fixture, 'input#confirmPassword + small');

      expect(confirmPasswordErrorMessage).toContain('match');
    });

    it('should #checkTerms field be invalid with UI', () => {
      const inputElement: HTMLInputElement = Testing.queryByCSS(fixture, 'input#terms').nativeElement;

      inputElement.checked = false;
      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.checkTermsField.invalid).withContext('terms form field invalid').toBeTruthy();

      expect(inputElement.attributes.getNamedItem('aria-invalid')?.value)
        .withContext('terms input with aria-invalid')
        .toBe('true');
    });
  });

  describe('Form sending', () => {
    it('should send form successfully', async () => {
      // Arrange
      const userMock = generateOneCustomer();
      component.form.patchValue({
        name: userMock.name,
        email: userMock.email,
        password: userMock.password,
        confirmPassword: userMock.password,
        checkTerms: true,
      });
      userService.create.and.returnValue(of(userMock));

      await new Promise(r => setTimeout(r, 2000)); // Debounce async validation

      // Act
      component.register(new Event('submit'));
      fixture.detectChanges();

      // Assert
      expect(component.form.valid).toBeTrue();
      expect(userService.create).toHaveBeenCalled();
    });

    it('should change status when form sent successfully', fakeAsync(() => {
      // Arrange
      const userMock = generateOneCustomer();
      component.form.patchValue({
        name: userMock.name,
        email: userMock.email,
        password: userMock.password,
        confirmPassword: userMock.password,
        checkTerms: true,
      });
      userService.create.and.returnValue(
        Testing.deferredResolve(userMock)
      );

      tick(500); // Due to debounce delay

      expect(component.status).withContext('initial state').toEqual('initial');

      // Act
      component.register(new Event('submit'));

      expect(component.status).toEqual('loading');

      tick();
      // Assert
      expect(component.form.valid).toBeTrue();
      expect(userService.create).toHaveBeenCalled();
      expect(component.status).toEqual('success');
    }));

    it('should change status when form sent successfully with UI', fakeAsync(() => {
      // Arrange
      const userMock = generateOneCustomer();
      userService.create.and.returnValue(
        Testing.deferredResolve(userMock)
      );
      // UI form input information
      Testing.inputData(fixture, 'input#name', userMock.name);
      Testing.inputData(fixture, 'input#email', userMock.email);
      Testing.inputData(fixture, 'input#password', userMock.password);
      Testing.inputData(fixture, 'input#confirmPassword', userMock.password);
      Testing.inputData(fixture, 'input#terms', true);
      const form = Testing.queryByCSS(fixture, 'form');
      const submitButton = Testing.queryByCSS(fixture, 'button[type="submit"]');

      tick(500); // Due to debounce delay

      expect(component.status).toEqual('initial');
      expect(submitButton.attributes['disabled']).toBeFalsy();

      // Act
      form.triggerEventHandler('ngSubmit', new Event('submit'));
      fixture.detectChanges();

      expect(component.status).toEqual('loading');
      expect(submitButton.attributes['disabled']).toEqual('');

      tick();
      // Assert
      expect(component.form.valid).toBeTrue();
      expect(userService.create).toHaveBeenCalled();
      expect(component.status).toEqual('success');
      expect(submitButton.attributes['disabled']).toBeFalsy();
    }));

    it('should change status when form send failed with UI', fakeAsync(() => {
      // Arrange
      const userMock = generateOneCustomer();
      userService.create.and.returnValue(
        Testing.deferredReject('Backend error')
      );
      // UI form input information
      Testing.inputData(fixture, 'input#name', userMock.name);
      Testing.inputData(fixture, 'input#email', userMock.email);
      Testing.inputData(fixture, 'input#password', userMock.password);
      Testing.inputData(fixture, 'input#confirmPassword', userMock.password);
      Testing.inputData(fixture, 'input#terms', true);
      const form = Testing.queryByCSS(fixture, 'form');
      const submitButton = Testing.queryByCSS(fixture, 'button[type="submit"]');

      tick(500); // Due to debounce delay

      expect(component.status).toEqual('initial');
      expect(submitButton.attributes['disabled']).toBeFalsy();

      // Act
      form.triggerEventHandler('ngSubmit', new Event('submit'));
      fixture.detectChanges();

      expect(component.status).toEqual('loading');
      expect(submitButton.attributes['disabled']).toEqual('');

      tick();
      // Assert
      expect(component.form.valid).toBeTrue();
      expect(userService.create).toHaveBeenCalled();
      expect(component.status).toEqual('failed');
      expect(submitButton.attributes['disabled']).toBeFalsy();
    }));
  });
});
