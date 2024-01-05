import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangePasswordService } from '../services/change-password.service';
import { ROUTE_PATH } from '../../../shared/constants/route-path.constant';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordForm: FormGroup;
  submitted = false;
  page_title: string;
  data_loading = false;
  showPassword = {
    old_password: false,
    new_password: false,
    confirm_password: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ChangePasswordService,
    private toastrService: NbToastrService,
    private dialogRef: NbDialogRef<ChangePasswordComponent>,
  ) { }

  ngOnInit(): void {
    this.ChangePasswordFormInitialize();
  }

  // Show Password
  getInputType(fieldName: string) {
    return this.showPassword[fieldName] ? 'text' : 'password';
  }

  toggleShowPassword(fieldName: string) {
    this.showPassword[fieldName] = !this.showPassword[fieldName];
  }

  /**
 * User Form Initialize controller
 */
  ChangePasswordFormInitialize() {
    this.ChangePasswordForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = false;

    if (this.ChangePasswordForm.invalid) {
      return;
    } // stop here if form is invalid

    const newPassword = this.ChangePasswordForm.value.new_password;
    const confirmPassword = this.ChangePasswordForm.value.confirm_password;

    if (newPassword !== confirmPassword) {
      this.toastrService.show("New password and confirm password do not match.", "Warning", {
        status: "warning",
        duration: 8000,
      });
      return;
    }
    const requestBody = {
      username: 'cowma',
      oldPassword: this.ChangePasswordForm.value.old_password,
      newPassword: this.ChangePasswordForm.value.confirm_password
    };
    // Call the API to update the password
    this.apiService.updateLogin(requestBody)
      .subscribe(
        response => {
          if (HttpStatusCode.Ok) {
            this.toastrService.show(response.statusMessage, 'Success', {
              status: 'success',
              duration: 8000,
            });
            this.submitted = true;
          }
          else if (HttpStatusCode.BadRequest) {
            this.toastrService.show(response.statusMessage, 'Danger', {
              status: 'danger',
              duration: 8000,
            });
          }
          else {
            this.toastrService.show(response.statusMessage, 'Warning', {
              status: 'warning',
              duration: 8000,
            });
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
            this.toastrService.show('Mismatched OldPassword.', 'Danger', {
              status: 'danger',
              duration: 8000,
            });
          }
        }
      );
  }



  back() {
    // this.router.navigate([ROUTE_PATH.ADMIN, ROUTE_PATH.USERS,ROUTE_PATH.USERES.LIST]);
    this.dialogRef.close();
  }

}