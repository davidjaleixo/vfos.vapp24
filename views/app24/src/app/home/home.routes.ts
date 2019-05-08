import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';

// import { AuthGuard } from '../_guards';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingComponent},
      { path: 'projects', component: ProjectsComponent},
      { path: 'projects/:idproject', component: ProjectdetailsComponent},
      { path: 'projects/:idproject/settings', component: ProjectsettingsComponent},
    ]
  }
];