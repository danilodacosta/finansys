import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';

@NgModule({
  declarations: [
    BreadCrumbComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // shared Modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // shared component
    BreadCrumbComponent
  ]
})
export class SharedModule { }
