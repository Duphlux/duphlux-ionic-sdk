import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { duphluxConfig } from './duphlux.interface';
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

  duphluxToken : string = '34792cda48f4f90736d3faed467503568b347ee0'; //get yours at https://duphlux.com
  // 34792cda48f4f90736d3faed467503568b347ee0 <--- testing token. See https://duphlux.com/documentation under "Call Simulator"
  // End Settings


  statusToast : any = {
    verified : {
      message : "Verification SuccessFul"
    },
    pending : {
      message : "Verification still pending..."
    },
    failed : {
      message : "Verification Failed. Try again"
    }
  }


  constructor(public http: Http) {
    // console.log('Hello DuphluxIoService Provider');
  }



  public setHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token', this.duphluxToken);
    headers.append('Cache-Control', 'no-cache');
    return headers;
  }

  public postRequest(data : duphluxConfig) {
    let headers = new RequestOptions({headers : this.setHeaders()});
    // this.data.phone_number = number;
    // this.data.timeout = timeout;
    // this.data.transaction_reference = transaction_ref;
    return this.http.post(this.url+'/authe/verify.json', data, headers);
  }

  public verifyRequestStatus(transaction_reference) {
    let body = {
      transaction_reference : transaction_reference
    };
    let headers = new RequestOptions({headers : this.setHeaders()});
    return this.http.post(this.url+'/authe/status.json', body, headers);
  }

  getRandomInt(min : number, max : number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getVerificationMessage(statusVerification : string){
    return this.statusToast[statusVerification].message
  }

}
