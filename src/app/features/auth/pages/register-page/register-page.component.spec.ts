import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';

import * as Testing from '@testing/index';
import { UserService } from '@core/services';

fdescribe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['create']);

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    })
    .compileComponents();

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
});
