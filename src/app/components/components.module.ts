import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    LoginComponent
  ]
})
export class ComponentsModule { }
