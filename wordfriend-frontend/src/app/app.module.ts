import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from "angularx-social-login";
import { googleClientId } from './config';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from "@angular/common/http"
import { httpInterceptorProviders } from './http-interceptor';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginGuardService } from './services/login-guard.service';
import { TrieService } from './services/trie.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleClientId)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    AuthService,
    AuthGuardService,
    LoginGuardService,
    TrieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
