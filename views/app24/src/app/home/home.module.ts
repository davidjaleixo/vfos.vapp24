import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule }    from '@angular/forms';


//import the home routes
import { homeRoutes } from './home.routes';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [LayoutComponent, LandingComponent, ProjectsComponent, ProjectdetailsComponent, ProjectsettingsComponent]
})
export class HomeModule { }
