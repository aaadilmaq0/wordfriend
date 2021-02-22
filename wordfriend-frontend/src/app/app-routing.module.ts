import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { MainModule } from './main/main.module';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "auth",
  },
  {
    path: "auth",
    loadChildren: () => AuthModule
  },
  {
    path: "main",
    canActivate: [AuthGuardService],
    loadChildren: () => MainModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
