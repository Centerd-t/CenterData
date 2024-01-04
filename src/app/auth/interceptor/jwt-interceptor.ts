/* 
*Interceptor file for adding jwt token on every http post request
* dev : T.Nanda Kumar
*/
import { Inject, Injectable, Injector, InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, retry, catchError } from 'rxjs/operators';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ROUTE_PATH } from '../../shared/constants/route-path.constant';


@Injectable()
export class NbAuthJWTInterceptor implements HttpInterceptor {

    constructor(private injector: Injector,private router : Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // do not intercept request whose urls are filtered by the injected filter
        //if (!this.filter(req)) {
        return this.authService.isAuthenticatedOrRefresh()
            .pipe(
                switchMap(authenticated => {
                    if (authenticated) {

                        return this.authService.getToken().pipe(
                            switchMap((token: NbAuthToken) => {
                                const JWT = `Bearer ${token.getValue()}`;
                                req = req.clone({
                                    setHeaders: {
                                        Authorization: JWT,
                                    },
                                });
                                return next.handle(req);
                            }),
                        )
                    } else {
                        // Request is sent to server without authentication so that the client code
                        // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
                        return next.handle(req);
                    }
                }),
            )
        //} else {
        //  return next.handle(req);
        //}
    }

    protected get authService(): NbAuthService {
        return this.injector.get(NbAuthService);
    }

}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private toastrService: NbToastrService,private router : Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(0),
                catchError((error: HttpErrorResponse) => {
                    if (error.status ==401){
                        this.toastrService.show("Unautherized", "Warn", { status: "warning", duration: 10000 });
                        let user_type = localStorage.getItem('user_type');
                        localStorage.clear()
                        this.router.navigateByUrl('/auth/' + user_type+"/login");
                    }
                    if (error.status == 401) {
                        window.confirm("Something Went Wrong! internal Server Error");
                    }
                    if (error.status == 500) {

                        this.toastrService.show(error.message, "Warn", { status: "warning", duration: 10000 });
                    }
                    if (error.status == 404) {

                        this.toastrService.show(error.message, "Error", { status: "danger", duration: 10000 });

                    }
                    return throwError(error);
                })
            )
    }
}