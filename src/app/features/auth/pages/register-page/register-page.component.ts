import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MyValidators } from '@utils/validators.utils';
import { UserService } from '@core/services';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  public form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
  ) {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), MyValidators.validPassword]],
        confirmPassword: ['', [Validators.required]],
        checkTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: MyValidators.matchPasswords,
      }
    );
  }

  public register(event: Event): void {
    event.preventDefault();
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    this.userService.create({
      ...value,
      avatar: 'https://i.pravatar.cc/150?img=1',
    }).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  public get nameField(): FormControl {
    return this.form.get('name') as FormControl;
  }

  public get lastNameField(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  public get emailField(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordField(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public get confirmPasswordField(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  public get checkTermsField(): FormControl {
    return this.form.get('checkTerms') as FormControl;
  }
}
