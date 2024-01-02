/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
*/
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NbChatModule, NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbTimepickerModule, NbToastrModule, NbWindowModule} from '@nebular/theme';
import { NbPasswordAuthStrategy, NbAuthModule,NbAuthJWTToken } from '@nebular/auth';

// module
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import {NgxAuthModule} from "../app/auth/auth.module";

// component
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// service
import { AuthLogin } from "./auth/services/auth-login.service";
import { AuthOptionsService } from "./auth/services/auth-options.service";

// guard
import { AuthGuardUser } from "./auth/services/auth-user-guard";
import { AuthGuard } from "./auth/services/auth-guard.service";

// Interceptor
import { HeaderInterceptor } from './shared/interceptor/header.interceptor';
import { NbAuthJWTInterceptor } from "./auth/interceptor/jwt-interceptor";
import { HttpErrorInterceptor } from "./auth/interceptor/jwt-interceptor";
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxAuthModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    
    /* For configure the login and logout paths with values */
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "username",
          baseEndpoint: environment.apiUrl,
          token: {
            key: "token",
            class: NbAuthJWTToken
          },
          login: {
            requireValidToken: true, // check token required
            endpoint: "api/Login", // api end point for login check
            method: "post", // method used to send
            redirect: {
              success: "admin", //redirect after successfull login
              failure: null
            }
          },
          logout: {
            endpoint: "logout",
            method: "post",
            redirect: {
              success: "auth/admin/login",
              failure: null
            }
          },
          requestPass: {
            endpoint: "password/forgot",
            method: "post"
          },
          resetPass: {
            endpoint: "password/reset",
            method: "post"
          },
          refreshToken: {
            endpoint: "switchLogin",
            method: "post",
            requireValidToken: true,
            redirect: {
              success: "app/dashboard/view?id=view",
              failure: null
            }
          },
          register: {
            endpoint: "switchLogin",
            method: "post",
            requireValidToken: true,
            redirect: {
              success: "app/dashboard/view?id=view",
              failure: null
            }
          }
        })
      ],
      forms: {
        login: {
          redirectDelay: 0, // delay before redirect after a successful login, while success message is shown to the user
          strategy: "username", // strategy id key.
          // rememberMe: true, // whether to show or not the `rememberMe` checkbox
          showMessages: {
            // show/not show success/error messages
            success: true,
            error: true
          }
        },
        requestPassword: {
          strategy: "username"
        },
        resetPassword: {
          strategy: "username"
        }
      }
    })
  ],
  providers: [
    AuthGuard,
    NbAuthJWTInterceptor,
    AuthLogin,
    AuthGuardUser,
    AuthOptionsService,
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}