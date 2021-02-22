import { Injectable, Injector, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiUrl } from '../config';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    public injector: Injector,
    public authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    let token = authService.getToken();
    if (token) token = token.split(' ').join('');
    request = request.clone({
      url: request.url.startsWith('http') ? request.url : ApiUrl + request.url,
      setParams: {
        token: token,
      },
    });
    console.log(request.url)
    return next.handle(request).pipe(
      tap(
        (response) => {
          if (response['status'] === 401) {
            this.authService.logout();
          }
        },
        (error) => {
          console.error(error);
        }
      )
    );
  }
}
