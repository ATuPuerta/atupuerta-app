import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private alertService: AlertService,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
  ) { }

  terms:boolean = false;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if( this.authService.isLoggedIn && this.authService.getAuthorization( ) )
        this.navCtrl.navigateRoot(['/home']);
    },
    err=>{
    });
  }

  async register(form:NgForm){
    console.log(form.value);
    if( !form.value.username || !form.value.username.trim()){
      this.alertService.presentToast("La nombre de usuario es requerido");
      return;
    }

    if( !form.value.name || !form.value.name.trim() ){
      this.alertService.presentToast("El nombre es requerido");
      return;
    }

    if( !form.value.email ){
      this.alertService.presentToast("El correo es requerido");
      return;
    }

    if( !form.value.password ){
      this.alertService.presentToast("La contraseña es requerida");
      return;
    }

    if( form.value.password != form.value.repassword ){
      this.alertService.presentToast("La contraseña y la confirmación no coinciden");
      return;
    }

    if( !this.terms ){
      this.alertService.presentToast("Debes aceptar los terminos y condiciones de uso");
      return;
    }
    
    let params = {
      username: form.value.username.trim(),
      password: form.value.password,
      email: form.value.email,
      name: form.value.name.trim(),
    };

    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();

    this.authService.register( params ).then(  value => {
      this.alertService.presentToast("Usuario registrado correctamente.");
      this.authService.login( params.username, params.password ).then(
        val => { 
          loading.dismiss();
          this.navCtrl.navigateRoot('/home');
        },
        err=> {
          loading.dismiss();
          
            this.alertService.presentToast("Error iniciando sección usuario.");
        }
      )
    }).catch( e => {
      console.log(e);
      loading.dismiss();
      this.alertService.presentToast(e.message);
    });
  }

  dismiss(){
    this.navCtrl.back();
  }

  onTerms(){
    this.navCtrl.navigateForward('/terms');
  }
}
