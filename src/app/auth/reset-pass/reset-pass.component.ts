/** 
* This file containes functions and templates related to reset password 
* author: T.Nanda Kumar
*/

import { NbAuthResult, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getDeepFromObject } from '../helpers/helpers';
import { AuthOptionsService } from '../services/auth-options.service';

@Component({
  selector: 'nbx-reset-password-page',
  styleUrls: ['./reset-pass.component.scss'],
  templateUrl: './reset-pass.component.html',
})


export class NbxResetPasswordComponent {

  redirectDelay: number = 0;  // redirect delay after password set
  showMessages: any = {};     // if any messgaes show to user
  strategy: string = '';      // strategy name

  submitted = false;          // to check form is submitted or not
  errors: string[] = [];      // error message array
  messages: string[] = [];    //other messages shown to user 
  user: any = {};             // user data to send for api end point
  token : string;             // tokend received from gmail

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected params: ActivatedRoute,
    protected authOpt: AuthOptionsService) {
      /* For Loading Values from app module */
    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
  }

  ngOnInit() {
    // to get reset token from URL
    this.token = this.params.snapshot.paramMap.get('token');
  }

  /**
   * resetPass()
   * function to reset the password
   * @return void
   */
  resetPass(): void {
   
    this.errors = this.messages = [];
    this.submitted = true;
    this.user["token"] = this.token;
    /* reset password service from NbAuthService  */
    this.service.resetPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }
      //redirect after password reset
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl("auth/" + this.authOpt.getUserType() +"/reset-password-message");
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }


  /**
   * Gets config value from NbAuthService
   * @param key 
   * @returns config value 
   */
  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}

/* secondary component to display success message */
@Component({
  selector: 'reset-pass-message',
  templateUrl: './reset-password-message.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassMessage {

}