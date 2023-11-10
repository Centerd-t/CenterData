import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { API_END_POINTS, getApiEndPoint } from '../../../shared/constants/api-constant';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
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

    //pass select user Details in User-Edit

  private userDetails = new BehaviorSubject<any>(null);

  setUserDetails(user: any) {
    this.userDetails.next(user);
  }

  getUserDetails() {
    return this.userDetails.asObservable();
  }

  /**
   * User List
   * @returns
   */
  getUserList(): Observable<any> {
    let apiURL = getApiEndPoint(API_END_POINTS.ANNOUNCEMENT.LIST);
    return this.userServicehttp.get(apiURL).pipe(
      switchMap((result: any) => {
        if (result) {
          return of(result);
        } else {
          return throwError(result);
        }
      })
    );
  }

  /**
   * Delete User
   * @param userId
   * @returns
   *
   */
  deleteUser(id: number): Observable<any> {
    let apiURL = getApiEndPoint(`${API_END_POINTS.ANNOUNCEMENT.DELETE}?id=${id}`);
    return this.userServicehttp.put(apiURL,null).pipe(
     switchMap((result: any) => {
      if (result) {
        return of(result);
      } else {
        return throwError(result);
      }
     })
    );
  }


  /**
   * Update User details
   * @param user
   * @returns
   *
   */
  updateUser(requestBody): Observable<any> {
    let apiURL = getApiEndPoint(`${API_END_POINTS.ANNOUNCEMENT.UPDATE}`);
    return this.userServicehttp.put(apiURL,requestBody).pipe(
      switchMap((result: any) => {
        if (result) {
          return of(result);
        } else {
          return throwError(result);
        }
      })
    );
  }



  /**
   * Create User
   * @param Values
   * @returns
   *
   */

  CreateAnnouncement(requestBody): Observable<any> {
    let apiURL = getApiEndPoint(`${API_END_POINTS.ANNOUNCEMENT.ADD}`);
    console.log(requestBody)
    return this.userServicehttp.post(apiURL,requestBody).pipe(
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
