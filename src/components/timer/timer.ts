import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

/**
 * countDown timer for duplux-ionic
 *
 *
 */
@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class Timer implements OnInit {
  @Input() timeInSeconds : number = 10;         // Default
  @Input() timerStatus : string = 'pending';    // Default status
  @Input() autoStart : boolean = true;          // If the counter should start initialized
  @Output() onTimerEnd = new EventEmitter();    // Output Function for parent.ts when the counter ends
  showSpinner : boolean = true;
  badgeColor : string;
  badgeMessage : string;
  timerEnded: boolean = false;
  timerMessage : any = {                         // Predefined messsages (and colors from src/theme/variable.scss) for timer message
    failed : {
      color : 'danger',
      message : 'Request has expired'
    },
    pending : {
      color : 'dark',
      message : 'Request is still pending'
    },
    verified : {
      color : 'emerald',
      message : 'Validated!'
    }
  }

  ngOnInit() {
    this.initTimer();
    // console.log(this.badgeColor);
  }

  constructor() {
    // console.log('Hello Timer Component');
    // this.text = 'Hello World';
  }

  /*
    Countdown to 0. Once it hits zero, emit a status to any parent.ts that its done.
  */
  countDown() {
    setTimeout(() => {
      this.timeInSeconds = this.timeInSeconds - 1;
      if(this.timeInSeconds < 1){
        this.timerEnded = true;
        // this.setTimerMessage('expired');
        this.emitEndOfTimer();
      }
      else {
        this.countDown();
      }
    }, 1000);
  }


  setTimerMessage(status:string) {
    // console.log('recieved from parent.ts: ', status);
    // console.log('color for badge is :', this.timerMessage[status].color);
    this.badgeColor = this.timerMessage[status].color;
    this.badgeMessage = this.timerMessage[status].message;
  }

  emitEndOfTimer() {
    this.onTimerEnd.emit({
      ended : true
    });
  }

  initTimer() {
    if(this.autoStart){
      this.showSpinner = false;
      this.countDown();
    }
  }

  startTimer(){
    this.showSpinner = false;
    this.countDown();
  }

}
