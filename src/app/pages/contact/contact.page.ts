import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  subscription:any;

  constructor(
    private platform: Platform,
    private navCtrl:NavController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

  onClickCardTop(){
    // this.navCtrl.navigateForward(['/cart']);
  }

}
