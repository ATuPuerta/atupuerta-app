import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  subscription:any;

  constructor(
    private platform: Platform,
    private navCtrl:NavController
  ) { }

  ngOnInit() {
  }

  // ionViewDidEnter(){
  //   this.subscription = this.platform.backButton.subscribe(()=>{
  //       navigator['app'].exitApp();
  //   });
  // }

  // ionViewWillLeave(){
  //   this.subscription.unsubscribe();
  // }

  doRefresh(event){
    event.target.complete();
  }  

  onClick(item){
    // this.navCtrl.navigateForward(['/chat/'+item]);
  }

  onClickCardTop(){
  }

}
