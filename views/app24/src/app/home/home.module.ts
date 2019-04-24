import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';

//import the home routes
import { homeRoutes } from './home.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
  ],
  declarations: [LayoutComponent, LandingComponent]
})
export class HomeModule { }
