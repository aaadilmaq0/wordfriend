import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from '../services/login-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
      path: "",
      pathMatch: "full",
      redirectTo: "login"
  },
  {
      path: "login",
      pathMatch: "full",
      canActivate: [LoginGuardService],
      component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
