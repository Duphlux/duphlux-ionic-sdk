import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ToastService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ToastService {

  constructor(
    public toastController : ToastController,
  ) {
    console.log('Toast Service');
  }

  ToastMsg(message, position : string = 'top', cssClass : string = 'toast-message-success') {

    // Create an instance of a toast message with configurations
    let toast = this.toastController.create({
      message: message,
      duration: 4000,
      position: position,
      cssClass: cssClass,
      showCloseButton : true
    })
    // Show the toast based on the settings above. Done
    toast.present();
  }

}
