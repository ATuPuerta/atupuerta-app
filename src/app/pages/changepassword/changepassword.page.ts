import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { UsersApi } from '../../services/api/users.api';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertService: AlertService,
    public usersApi: UsersApi,
  ) { }

  ngOnInit() {
  }

  async change(form){
    console.log(form.value);
    if( !form.value.old_password ){
      this.alertService.presentToast("La contraseña actual es requerida");
      return;
    }

    if( !form.value.new_password ){
      this.alertService.presentToast("La contraseña es requerida");
      return;
    }

    if( form.value.new_password != form.value.renew_password ){
      this.alertService.presentToast("La contraseña y la confirmación no coinciden");
      return;
    }

    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    this.usersApi.changePassword( form.value.old_password, form.value.new_password ).subscribe(
      data => {
        loading.dismiss();
        this.dismiss();
        this.alertService.presentToast("La contraseña ha sido cambiada correctamente");
      },
      err=>{
        loading.dismiss();
        this.alertService.presentToast(err.message);
      },
      () => {

      }
    )
  }

  dismiss(){
    this.navCtrl.back();
  }
}
