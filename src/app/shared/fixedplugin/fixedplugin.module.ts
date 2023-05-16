import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedpluginComponent } from './fixedplugin.component';
import { RouterModule } from '@angular/router';



@NgModule({
  imports:[ RouterModule, CommonModule, NgModule ],
  declarations: [ FixedpluginComponent ],
  exports: [
    FixedpluginComponent
  ]
})
export class FixedpluginModule { }
