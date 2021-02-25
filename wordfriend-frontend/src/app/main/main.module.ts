import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../material/material.module';
import { InsertComponent } from './insert/insert.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    InsertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    MaterialModule
  ]
})
export class MainModule { }
