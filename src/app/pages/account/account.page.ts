import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera  } = Plugins;
import { UsersApi } from '../../services/api/users.api';
import { AuthService } from '../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user:any = {};
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
  }

  async update(form:any){
    if( !form.value.name ){
      this.alertService.presentToast("El nombre es requerido");
      return;
    }

    if( !form.value.email ){
      this.alertService.presentToast("El correo es requerido");
      return;
    }

    if( !form.value.movil_number ){
      this.alertService.presentToast("El número de celular es requerido");
      return;
    }

    if( !form.value.provincia ){
      this.alertService.presentToast("La provincia es requerida");
      return;
    }

    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    let params:any = form.value;
    params.profile_picture = this.user.profile_picture;
    this.usersApi.update( this.authService.token.userId, params, {fields:'id,profile_picture'} ).subscribe(
      data => {
        this.user.profile_picture = data.profile_picture;
        this.authService.setUser( this.user );
        loading.dismiss();
        this.alertService.presentToast("Los datos han sido guardados correctamente");
      },
      err => {
        loading.dismiss();
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
