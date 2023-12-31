import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";

// Rxjs
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

// constant
import { API_END_POINTS, getApiEndPoint } from "../../../shared/constants/api-constant";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

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

  /**
   * CenterData List
   * @returns
   */
 getCenterDataList(selectedDate: string): Observable<any> {
    let apiURL = getApiEndPoint(API_END_POINTS.USER.LIST);
        const urlWithParams = `${apiURL}?Date=${selectedDate}`;
    return this.userServicehttp.post(urlWithParams,null).pipe(
      switchMap((result: any) => {
        if (result) {
          return of(result);
        } else {
          return throwError(result);
        }
      })
    );
  }
z}
