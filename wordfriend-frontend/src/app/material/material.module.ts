import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ],
  exports:[
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MaterialModule { }