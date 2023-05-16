import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedpluginComponent } from './fixedplugin.component';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports:[ RouterModule, CommonModule, NgbModule ],
  declarations: [ FixedpluginComponent ],
  exports: [
    FixedpluginComponent
  ]
})
export class FixedpluginModule { }
