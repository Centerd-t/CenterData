/** 
* This file contains login related functions
* author: Gowtham rangaraju
*/

import { NbLoginComponent, NbAuthResult, NbAuthSocialLink, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Router } from '@angular/router';
import { getDeepFromObject } from '../helpers/helpers';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AuthOptionsService } from '../services/auth-options.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})

/*  extended NbLoginComponent for our custom login design*/
export class NgxLoginComponent {
  forget_path = "company"; //for redirecting company and admin when login
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = "";

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  rememberMe = false;


   

    constructor(protected service: NbAuthService,
        @Inject(NB_AUTH_OPTIONS) protected options = {},
        protected cd: ChangeDetectorRef,
        protected router: Router,
        private authService: AuthOptionsService,
        private route: ActivatedRoute) {

        this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
        this.showMessages = this.getConfigValue('forms.login.showMessages');
        this.strategy = this.getConfigValue('forms.login.strategy');
        this.socialLinks = this.getConfigValue('forms.login.socialLinks');
        this.rememberMe = this.getConfigValue('forms.login.rememberMe');
    }

    ngOnInit() {
        localStorage.clear()
        let setUser = "company";
        //To get the type of user, from which URL user access the login page
        try {
            let loginType = window.location.href.split("/");
            let userType = loginType[loginType.length - 2];
            if (userType == "admin") {
                setUser = "admin";
            }
        }
        catch (err) {
            console.log(err);
        }
        localStorage.setItem('user_type', setUser); //sets a local storage value for user type
        this.forget_path = setUser;
    }


  /**
   * Logins ngx login component,  overridden the native ngx login function
   * This function is used to check login with backend with values given in app.module
   * @return void
   */
  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.user["role"] = this.forget_path;
    /* ngx-auth service has been used authenticate user */
    this.service
      .authenticate(this.strategy, this.user)
      .subscribe((result: NbAuthResult) => {
        console.log(result);
        this.submitted = false;

            if (result.isSuccess()) {
                 this.messages = result.getMessages();
                // this.authService.setUserPermissons(result["response"].body.data.userPermission);

            } else {
                this.errors = result.getErrors();
            }

        const redirect = result.getRedirect();
        if (redirect) {
          return this.router.navigateByUrl(redirect);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}