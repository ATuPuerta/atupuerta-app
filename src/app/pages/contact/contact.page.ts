import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, LoadingController} from '@ionic/angular';
import { ContactsApi } from '../../services/api/contacts.api';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  subscription:any;
  @ViewChild('myTextarea', {static:true}) myTextarea: ElementRef;
  text:string;

  constructor(
    private platform: Platform,
    private navCtrl:NavController,
    private loadingCtrl:LoadingController,
    private contactsApi:ContactsApi,
    private alertService:AlertService,
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

  onClickCardTop(){
    // this.navCtrl.navigateForward(['/cart']);
  }

  resizeTextarea(){
    this.myTextarea.nativeElement.style.height = this.myTextarea.nativeElement.scrollHeight + 'px';
  }

  async send(){
    let loading = await this.loadingCtrl.create( { message:"Enviando" } )
    await loading.present();
    this.contactsApi.send( this.text.trim() ).subscribe(
      data => {
        this.text = "";
        this.myTextarea.nativeElement.style.height = '120px';
        loading.dismiss();
        this.alertService.presentToast("Su mensaje ha sido enviado");
      },
      err => {
        loading.dismiss();
        if( err && err.length )
          this.alertService.presentToast(err.message); 
        else
          this.alertService.presentToast("Error enviando mensaje, intentelo nuevamente"); 
      },
      () => {
      }
    )
  }

}
