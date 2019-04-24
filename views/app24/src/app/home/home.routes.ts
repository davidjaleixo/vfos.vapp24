import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';

// import { AuthGuard } from '../_guards';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingComponent}
    ]
  }
];