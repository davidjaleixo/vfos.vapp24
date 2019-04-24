import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule }    from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

//import the app main routes
import { APP_ROUTES } from "./app.routes";
//import our modules
import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    HomeModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
