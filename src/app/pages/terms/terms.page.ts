import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  subscription:any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
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

  dismiss(){
    this.navCtrl.back();
  }

}
