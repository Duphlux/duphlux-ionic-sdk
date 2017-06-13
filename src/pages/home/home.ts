// Developed by Audacitus. Homecrafted Themes and Apps for the IonicFramework
// For custom themes, and plugins in Ionic 2
// https://www.audacitus.com/site

import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, Http, RequestOptions } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { DuphluxIoService } from '../../providers/duphlux-io-service';
import { ToastService } from '../../providers/toast-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('timer') timer;    // points to our <timer #timer ... ></timer> in home.html

  // Your settings go here
  timeToLive : number = 10;                         // Number of seconds before the verification_status expires
  youOwnPhoneNumber : string = "+2347032793568";    // Your own phone number. Supply via navParams or elsewise.
  transactionReference : number = this.getRandomInt(10000,100000);  // supply yours or use this.getRandomInt() to get a random number
  duphluxToken : string = '34792cda48f4f90736d3faed467503568b347ee0'; //get yours at https://duphlux.com
  // 34792cda48f4f90736d3faed467503568b347ee0 <--- testing token. See https://duphlux.com/documentation under "Call Simulator"
  // End Settings


  // For usage in this class only:
  payLoad : any;                                    // our response object
  status : any;                                     // class variable to hold our status from this.payLoad
  dupluxNumber : string;                            // Phone number to call. supplied from this.payLoad
  dialerLaunched : boolean = false;                 // true/false when the call button is triggered
  enableVerifyButton : boolean = false;
  enableCallButton : boolean = false;
  verificationSuccess : boolean = false;
  statusToast : any = {
    verified : {
      message : "Verification SuccessFul"
    },
    pending : {
      message : "Verification Still pending"
    },
    failed : {
      message : "Verification Failed"
    }
  }

  constructor(
    public navCtrl: NavController,
    public http : Http,
    private callNumber: CallNumber,
    private duphlux : DuphluxIoService,
    private toaster : ToastService
  ) {

  }
  ionViewDidLoad() {
    this.createDuphluxToken();
  }

  public setHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token', this.duphluxToken);
    headers.append('Cache-Control', 'no-cache');
    return headers;
  }

  public createDuphluxToken() {
    let headers = new RequestOptions({headers : this.setHeaders()});
    this.duphlux.postRequest(this.youOwnPhoneNumber, headers, this.timeToLive, this.transactionReference).subscribe(
      (data) => {
        this.payLoad = data.json();
        console.log('Duplux Data:', this.payLoad.PayLoad.data);
        console.log('Duplux Number:', this.payLoad.PayLoad.data.number);
        this.dupluxNumber = this.payLoad.PayLoad.data.number;
        this.enableVerifyButton = true;
        this.enableCallButton = true;
        this.timer.startTimer();  //trigger the <itimer> method to start counting
      },
      (error) => {
        console.log(error);
        this.enableVerifyButton = false;
      }
    )
  }


  // Function to call supplied number.
  // Needs @ionic-native/call-number installed
  public makeTheCall() {
    this.callNumber.callNumber(this.dupluxNumber, true)
      .then(() => {
        // alert('Launched dialer!');
        this.dialerLaunched = true;
      })
      .catch(() => {
        console.error('Error launching dialer! Make sure:');
        console.error('- Your Number is in string');
        console.error('- @ionic-native/call-number is installed');
        console.error('- You are not trying this in the browser, are you? - :D');
        alert('Error launching dialer!');
      });
  }

  verifyRequestStatus() {
    let headers = new RequestOptions({headers : this.setHeaders()});
    let process = this.duphlux.verifyRequestStatus(this.transactionReference, headers);
    process.subscribe(
      (data) => {
          this.status = data.json();
          console.log(this.status.PayLoad.data);
          this.statusGenerator(this.status);
        },
      (error) => {
        console.log(error);
      }
    )
  }


  public timerEnd($event) {
    // console.log($event);

    // event to fire once <itimer> counts to zero..
    this.verifyRequestStatus();
  }


  // Get the status from the payload. status.
  // PayLoad.data.verification_status will return "verified", or "failed" "pending"
  public statusGenerator(status){
    if(status && status.PayLoad.data && status.PayLoad.status){
      console.log('PayLoad is valid. PayLoad Status is:', status.PayLoad.status);
      console.log('Verification Status is: ', status.PayLoad.data.verification_status);
      this.timer.setTimerMessage(status.PayLoad.data.verification_status);
      this.toaster.ToastMsg(this.statusToast[status.PayLoad.data.verification_status].message, 'bottom');
      return status.PayLoad.status;
    }
    else {
      console.log('PayLoad is not valid');
    }
  }

  // Random number generator. For transaction reference.
  getRandomInt(min : number, max : number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
