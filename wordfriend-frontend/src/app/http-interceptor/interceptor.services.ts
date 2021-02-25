import { Injectable, Injector, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ApiUrl } from '../config';
import { SpinnerService } from '../services/spinner.service';
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private count = 0;
  constructor(
    public injector: Injector,
    public authService: AuthService,
    private spinnerService: SpinnerService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(this.count===0) this.spinnerService.setHttpProgressStatus(true);
    this.count++;
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
      ),
      finalize(() => {
        this.count--;
        if(this.count===0) this.spinnerService.setHttpProgressStatus(false);
      })
    );
  }
}
