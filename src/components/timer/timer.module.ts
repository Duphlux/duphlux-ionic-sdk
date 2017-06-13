import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Timer } from './timer';

@NgModule({
  declarations: [
    Timer,
  ],
  imports: [
    IonicPageModule.forChild(Timer),
  ],
  exports: [
    Timer
  ]
})
export class TimerModule {}
