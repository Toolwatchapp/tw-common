import { Component, Output, EventEmitter, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TwAPIService } from './../../services/twapi.service';
import { GlobalValidator } from './../global-validator';
import { AnalyticsService } from './../../services/analytics.service';

import {   
  Validators,
  FormBuilder,  
  FormGroup
} from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

/**
 * Signup form. Emits a userLogged event on new user signup
 */
@Component({
  template: ''
})
export class SignupComponent {

  signupForm: FormGroup;
  submitAttempt: boolean  = false;
  errors: string[] = [];
  countries: string[] = [];
  filteredList: string[] = [];
  query: string   = "";

  @Output() userLogged = new EventEmitter();
  @Output() signupAttempt = new EventEmitter();

   /**
   * Constructor w/ service injection
   * @param {TranslateService} private translate [description]
   * @param {TwAPIService}     private twapi     [description]
   * @param {FormBuilder}      private builder   [description]
   */
  constructor(
    protected   translate: TranslateService, 
    private     twapi: TwAPIService, 
    private     formBuilder: FormBuilder,
    protected   analytics: AnalyticsService
  ) { 

    translate.setDefaultLang('en');
    translate.use('en');

    translate.get("countries").subscribe((result: [string]) => {
      this.countries = result;
    });

    this.signupForm = this.formBuilder.group({
        email         : ["", Validators.compose([Validators.required, GlobalValidator.mailFormat])],
        emailRepeat   : ["", Validators.compose([Validators.required, GlobalValidator.mailFormat])],

        password      : ["", Validators.compose([Validators.required, Validators.minLength(8)])],
        passwordRepeat: ["", 
          Validators.compose([
            Validators.required, 
            Validators.minLength(8)
          ])
        ],
        lastName      : "",
        firstName     : "",
        country       : ""
      });
  }


  /**
   * Trims the filteredList accoring to the 
   * country field
   * @param {string} query [description]
   */
  filter(query:string) {
    this.filteredList = this.countries.filter(function(element:string){
      return element.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
  }

  /**
   * Assign the country label when selected 
   * from the list
   * @param {string} item [description]
   */
  select(item:string) {
    this.query = item;
    this.filteredList = [];
  }

  /**
   * submit the form
   * @param {string} user [description]
   */
  onSubmit(user:{
      email: string, 
      password: string,
      emailRepeat: string,
      passwordRepeat: string,
      lastName: string,
      firstName: string
    }) {

    this.submitAttempt = true;
    this.errors = [];


    if(this.signupForm.valid && 
      user.password === user.passwordRepeat &&
      user.email === user.emailRepeat) {

      this.signupAttempt.emit(true);

      this.twapi.signup(user.email,
       user.password,
       user.firstName,
       user.lastName,
       this.query).then(
        res => { 
          this.analytics.event('CTA', 'SIGNUP', 'SUCCESS');
          this.userLogged.emit(res); 
        },
        error => {
          this.analytics.event('CTA', 'SIGNUP', 'FAIL');
          switch (error.status) {
            case TwAPIService.HTTP_UNAUTHORIZED:
              this.errors.push('email-taken');
              break;
            default:
              this.errors.push('error');
              break;
          }
        }
       );

      this.signupAttempt.emit(false);
    } else {

      if(user.password !== user.passwordRepeat) {
        this.errors.push('password-match');
      }

      if(user.email !== user.emailRepeat) {
        this.errors.push('email-match');
      }
    }
  }
}

@NgModule({
  declarations: [SignupComponent],
  imports: [FormsModule, TranslateModule],
  exports: [SignupComponent],
  providers: [
    TwAPIService
  ],
})
export class SignupComponentModule { }