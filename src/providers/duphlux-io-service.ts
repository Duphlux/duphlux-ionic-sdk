import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

/*
  Generated class for the DuphluxIoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DuphluxIoService {

  // You settings go here

  url : string = 'https://duphlux.com/webservice';   // api url to duphlux service
  payLoad : any;                                    // our response object
  status : any;                                     // class variable to hold our status from this.payLoad
  timeToLive : number = 30;                         // Number of seconds before the verification_status expires. Default is set here
  dupluxNumber : string;                            // Phone number to call. supplied from this.payLoad
  dialerLaunched : boolean = false;                 // true/false when the call button is triggered
  youOwnPhoneNumber : string = "+2347032793568";    // Your own phone number. Supply via navParams or
  transactionReference : number = this.getRandomInt(10000,100000);  //supply yours or use this.getRandomInt() to get a random number
  // End Settings

  data = {
    phone_number : this.youOwnPhoneNumber,
    transaction_reference : this.transactionReference,
    timeout: this.timeToLive,
    redirect_url :"https://audacitus.com/site"
  }

  constructor(public http: Http) {
    console.log('Hello DuphluxIoService Provider');
  }

  public postRequest(number, options, timeout : number, transaction_ref : number) {
    this.data.phone_number = number;
    this.data.timeout = timeout;
    this.data.transaction_reference = transaction_ref;
    return this.http.post(this.url+'/authe/verify.json', this.data, options);
  }

  public verifyRequestStatus(transaction_reference, headers) {
    let body = {
      transaction_reference : transaction_reference
    };
    return this.http.post(this.url+'/authe/status.json', body, headers);
  }

  getRandomInt(min : number, max : number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
