/**
 * This file containes functions related to logout
 * 
 * author : T.Nanda Kumar
 */
import { Component, Input} from '@angular/core';
import { NbLogoutComponent } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'nbx-logout',
  templateUrl: './logout.component.html',
})
/* class extended from NbLogoutComponent which is inbuild component of theme*/
export class NbxLogoutComponent extends NbLogoutComponent  {

  /**
   * on init
   * When this component is called, we will remove the user token from local storage
   * redirect the user to login screen
   * 
   */
  ngOnInit() {
    //removes jwt token from local storage
    let user_type = localStorage.getItem('user_type');
    localStorage.removeItem('auth_app_token');
    localStorage.removeItem('usr_prm');
    this.router.navigateByUrl('/auth/' + user_type+"/login");
  }
}