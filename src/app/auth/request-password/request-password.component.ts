/** 
*This component file containes functions related to request password
* author: T.Nanda Kumar
*/
import { NbAuthResult, NbAuthService,NB_AUTH_OPTIONS} from '@nebular/auth';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { getDeepFromObject } from '../helpers/helpers';
import { AuthOptionsService } from '../services/auth-options.service';

@Component({
  selector: 'ngx-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})

export class RequestPassComponent {

  redirectDelay: number = 0;              // redirect delay after request
  showMessages: any = {};                 // messages show user
  strategy: string = '';                  // startergy used for request
  check_duplicate_mail:boolean = true;    // to check duplicate mail exist in server

  submitted = false;                      // check form is submitted or not
  errors: string[] = [];                  // errors message array
  messages: string[] = [];                
  user: any = {};                         // to pass user details to api 

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private authOpt: AuthOptionsService) {

    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');
    this.strategy = this.getConfigValue('forms.requestPassword.strategy');
  }

  /**
   * requestPass
   * For requesting New Password from forget password screen
   * @returns void
   */
  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.user["accountType"] = this.authOpt.getUserType();
    /* used extended service of NbAuthService */
    this.service.requestPassword(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

    /* redirect after the forget password email has been send to user */
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl("auth/" + this.authOpt.getUserType()+"/request-password-message");
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }

/**
 * checkEmail
 * For requesting new password from forget password screen.
 *
 */

  checkEmail(event){
    /* service to check email exists in database */
    let accountType = this.authOpt.getUserType();
    this.authOpt.checkEmailExist(event.target.value, accountType).subscribe((resposne) => {
      if (resposne["status"] !=200){
        this.check_duplicate_mail = true;
        this.errors = [resposne["message"]];
      }else{
        this.check_duplicate_mail = false;
        this.errors = [];
      }
    }, error => {
        this.errors = ["somethink went wrong"];
    }
    );
    this.cd.detectChanges();
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}

/* 
* component for loading after request password mail send
*/
@Component({
  selector: 'mequest-pass-message',
  templateUrl: './request-password-message.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestMessage {

 }