import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent,NgbdModalContent,chatRequestNotification } from './app.component';
import { AngularFireModule } from 'angularfire2';
import {RouterModule, Routes} from "@angular/router";
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {AF} from "./providers/af";
import {Global} from "./providers/global";
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { BasicDetailsFormComponent } from './basic-details-form/basic-details-form.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NewPostFormComponent } from './new-post-form/new-post-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { SearchResultComponent } from './search-result/search-result.component';



export const firebaseConfig = {
  apiKey: 'AIzaSyByT0b0yHtVIr5anb678wl6NJwV_0P7Znc',
  authDomain: 'intelectron-fc0d5.firebaseapp.com',
  databaseURL: 'https://intelectron-fc0d5.firebaseio.com',
  storageBucket: 'intelectron-fc0d5.appspot.com',
  messagingSenderId: '558664208356',
   projectId: "intelectron-fc0d5",
};

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'Login', component: LoginPageComponent },
  { path: 'register', component: CreateNewUserComponent },
  { path: 'userLogin', component: UserLoginComponent },
  { path: 'basicDetailsForm', component: BasicDetailsFormComponent },
   { path: 'home', component: UserDashboardComponent },
   { path: 'createNewPost', component: NewPostFormComponent },
   { path: 'profile', component: ProfileComponent },
   { path: 'post', component: PostDetailsComponent },
    { path: 'searchResult', component: SearchResultComponent },
   
];
@NgModule({
  declarations: [
    AppComponent,
	NgbdModalContent,
  chatRequestNotification,
    LoginPageComponent,
    HomePageComponent,
    CreateNewUserComponent,
    UserLoginComponent,
    BasicDetailsFormComponent,
    UserDashboardComponent,
    NewPostFormComponent,
    ProfileComponent,
    PostDetailsComponent,
    SearchResultComponent,
	
  ],
  imports: [
    BrowserModule,
    FormsModule,
	ReactiveFormsModule,
    HttpModule,
	AngularFireModule.initializeApp(firebaseConfig),
	RouterModule.forRoot(routes),
	NgbModule.forRoot(),
	Ng2OrderModule
  ],
  providers: [AF,LocalStorageService,SessionStorageService,Global,AppComponent],
  bootstrap: [AppComponent],
  entryComponents:[NgbdModalContent,chatRequestNotification],
   
  
})
export class AppModule { }
