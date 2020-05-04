import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera  } = Plugins;
import { UsersApi } from '../../services/api/users.api';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  @ViewChild( 'movil', {static:true} ) movil: any;
  @ViewChild( 'phone', {static:true} ) phone: any;
  itiPhone:any;
  itiMovil:any;
  iphone:any;
  imovil:any;

  user:any;
  loadingIni:any;

  constructor(
    private navCtrl:NavController,
    private loadingCtrl:LoadingController,
    private alertService:AlertService,
    private storage: NativeStorage,
    private usersApi: UsersApi,
    private authService: AuthService,
  ) { }

  ngOnInit() {   
    this.iniData();
  }

  async iniData(){
    this.user = this.authService.user;

    this.iphone = document.getElementById('phone_number');
    
    this.itiPhone = intlTelInput(this.iphone, {
      initialCountry: "cu",
      preferredCountries: ["cu"],
      utilsScript: './assets/js/utils.js',
      separateDialCode: true,
      autoHideDialCode:true,
      autoPlaceholder:"off"
    });

    this.itiPhone.promise.then( (d) => {
      this.itiPhone.setNumber(this.user.phone_number);
    } )

    this.imovil = document.getElementById('movil_number');

    this.itiMovil = intlTelInput(this.imovil, {
      initialCountry: "cu",
      preferredCountries: ["cu"],
      utilsScript: './assets/js/utils.js',
      separateDialCode: true,
      autoHideDialCode:true,
      autoPlaceholder:"off"
    });

    this.itiMovil.promise.then( (d) => {
      this.itiMovil.setNumber(this.user.movil_number);
    } )
  }

  async update(form:any){
    console.log(this.itiMovil.isValidNumber())
    console.log(this.itiMovil.getNumber())
    console.log(this.user.movil_number)
    console.log(this.itiPhone.isValidNumber())
    console.log(this.itiPhone.getNumber())
    console.log(this.user.phone_number)

    if( !this.user.name.trim() || !this.user.name.trim() ){
      this.alertService.presentToast("El nombre es requerido");
      return;
    }

    if( !this.user.email ){
      this.alertService.presentToast("El correo es requerido");
      return;
    }

    if( this.itiPhone.getNumber() && !this.itiPhone.isValidNumber() ){
      this.alertService.presentToast("El número de télefono fijo no es válido");
      return;
    }

    if( this.itiMovil.getNumber() && !this.itiMovil.isValidNumber() ){
      this.alertService.presentToast("El número de celular no es válido");
      return;
    }

    if( !this.user.provincia ){
      this.alertService.presentToast("La provincia es requerida");
      return;
    } 

    let loading = await this.loadingCtrl.create( { message:"Actualizando" } )
    await loading.present();

    this.user.name = this.user.name.trim();
    this.user.phone_number = this.itiPhone.getNumber();
    this.user.movil_number = this.itiMovil.getNumber();

    let params:any = {
      name: this.user.name,
      email: this.user.email,
      provincia: this.user.provincia,
      profile_picture: this.user.profile_picture,
      phone_number: this.user.phone_number,
      movil_number: this.user.movil_number
    }

    this.usersApi.update( this.authService.token.userId, params, {fields:'id,profile_picture'} ).subscribe(
      data => {
        this.user.profile_picture = data.profile_picture;
        this.authService.setUser( this.user );
        loading.dismiss();
        this.alertService.presentToast("Los datos han sido guardados correctamente");
      },
      err => {
        loading.dismiss();
        if( err && err.length )
          this.alertService.presentToast(err[0].message); 
        else
          this.alertService.presentToast("Error actualizando los datos"); 
      },
      () => {
      }
    )
  }

  onClickCardTop(){
    // this.navCtrl.navigateForward(['/cart']);
  }

  onCamera(){
    Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      correctOrientation:true,
      saveToGallery:true,
      source:CameraSource.Prompt,
      width:768
    }).then( image => {
      this.user.profile_picture  = image.dataUrl;
    } ).catch( err => this.alertService.presentToast("Camara: Error") );
  }

  changePassword(){
    this.navCtrl.navigateForward(['/changepassword']);
  }
}
