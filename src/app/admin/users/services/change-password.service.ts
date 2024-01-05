import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

// constant
import { API_END_POINTS, getApiEndPoint } from "../../../shared/constants/api-constant";
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  user = {};

  constructor(
    private userServicehttp: HttpClient,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
      }
    });
  }

  updateLogin(requestBody: any): Observable<any> {

    let apiURL = getApiEndPoint(API_END_POINTS.LOGIN.UPDATE);

    return this.userServicehttp.put(apiURL, requestBody).pipe(
      switchMap((result: any) => {
        if (result) {
          return of(result);
        } else {
          return throwError(result);
        }
      })
    );

  }
}
