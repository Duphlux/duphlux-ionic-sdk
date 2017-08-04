// Developed by Audacitus. Homecrafted Themes and Apps for the IonicFramework
// For custom themes, and plugins in Ionic 2/3
// https://www.audacitus.com/site

import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
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

  // For usage in this class only:
  payLoad : any;                                    // our response object
  status : any;                                     // class variable to hold our status from this.payLoad
  dupluxNumber : string;                            // Phone number to call. supplied from this.payLoad
  dialerLaunched : boolean = false;                 // true/false when the call button is triggered


  enableVerifyButton : boolean = false;
  enableCallButton : boolean = false;

  // Your settings go here
  DuphluxSettings = {
    timeout : 60, //Number                         // Number of seconds before the verification_status expires
    phone_number :  "+000000000000", //string    // Your own phone number. Supply via navParams or elsewise.
    transaction_reference : this.getRandomInt(10000,100000), //string  // supply yours or use this.getRandomInt() to get a random number
    redirect_url : "https://yourdomain.com"
  }
  // End Settings

  constructor(
    public navCtrl: NavController,
    public http : Http,
    private callNumber: CallNumber,
    private duphlux : DuphluxIoService,
    private toaster : ToastService,
    private alert : AlertController
  ) {

  }
  ionViewDidLoad() {
    this.createDuphluxToken();
  }


  public createDuphluxToken() {

    // let headers = new RequestOptions({headers : this.setHeaders()});
    this.duphlux.postRequest(this.DuphluxSettings).subscribe(
      (data) => {
        this.payLoad = data.json();
        if(this.payLoad.PayLoad.data == null){
          this.createDuphluxToken();
        }
        else {
          console.log('Duplux Data:', this.payLoad.PayLoad.data);
          console.log('Duplux Number:', this.payLoad.PayLoad.data.number);
          this.dupluxNumber = this.payLoad.PayLoad.data.number;
          this.enableVerifyButton = true;
          this.enableCallButton = true;
          this.timer.startTimer();  //trigger the <itimer> method to start counting
        }
      },
      (error) => {
        console.log(error);
        // alert(error);
        this.enableVerifyButton = false;
      }
    )
  }


  // Function to call supplied number.
  // Needs @ionic-native/call-number installed
  public makeTheCall() {
    this.callNumber.callNumber(this.dupluxNumber, false)
      .then(() => {
        // alert('Launched dialer!');
        this.dialerLaunched = true;
        setTimeout(
          ()=>{
            this.verifyRequestStatus();
          },
          6000)
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
    this.enableVerifyButton = false;
    // let headers = new RequestOptions({headers : this.setHeaders()});
    let process = this.duphlux.verifyRequestStatus(this.DuphluxSettings.transaction_reference);
    process.subscribe(
      (data) => {
          this.status = data.json();
          console.log(this.status.PayLoad.data);
          // console.log(this.getStatusOfToken(this.status));
          let status = this.getStatusOfToken(this.status);

          if(status.verification == 'verified'){
             let alert = this.alert.create({
              title: 'Verification Successful',
              // subTitle: this.DuphluxSettings.phone_number+' has been verified',
              subTitle: 'You number has been verified!',
              buttons: ['Dismiss']
            });
            alert.present();

            this.navigateOnVerificationSuccess()
          }
          else if(status.verification == 'pending'){
            this.toaster.ToastMsg(this.duphlux.getVerificationMessage(status.verification), 'bottom');
            setTimeout(
              ()=>{
                console.log('repeat request');
                this.verifyRequestStatus()
              },
              10000)
          }
        },
      (error) => {
        console.log(error);
        this.enableVerifyButton = true;
      }
    )
  }

  // Get the status from the payload. status.
  // PayLoad.data.verification_status will return "verified", or "failed" "pending"
  public getStatusOfToken(status){
    if(status && status.PayLoad.data && status.PayLoad.status){
      console.log('PayLoad is valid. PayLoad Status is:', status.PayLoad.status);
      console.log('Verification Status is: ', status.PayLoad.data.verification_status);
      let info = {
        status : status.PayLoad.status,
        verification : status.PayLoad.data.verification_status
      };
      return info;
    }
    else {
      console.error('PayLoad is not valid');
    }
  }

  public timerEnd($event) {
    // event to fire once <itimer> counts to zero..
    this.verifyRequestStatus();
  }

  // Random number generator. For transaction reference.
  getRandomInt(min : number, max : number) {
      let random =  Math.floor(Math.random() * (max - min + 1)) + min;
      return random.toString();
  }

  public navigateOnVerificationSuccess(){
    //Navigate to Our other page
  }

}
