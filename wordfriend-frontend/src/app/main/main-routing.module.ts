import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InsertComponent } from './insert/insert.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "home",
    pathMatch: "full",
    component: HomeComponent
  },
  {
    path: "add",
    pathMatch: "full",
    component: InsertComponent
  },
  {
    path: "edit/:wordToEdit",
    pathMatch: "full",
    component: InsertComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
