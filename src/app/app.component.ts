import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController  } from '@ionic/angular';
import { Platform, IonMenu } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home-outline',
      direction: 'root',
      isLogin:false
    },
    {
      title: 'Favoritos',
      url: '/favorites',
      icon: 'heart-outline',
      direction: 'root',
      isLogin:true
    },
    // {
    //   title: 'Mensajes',
    //   url: '/messages',
    //   icon: 'chatbubbles-outline',
    //   direction: 'root',
    //   isLogin:true
    // },
    {
      title: 'Mis Productos',
      url: '/products',
      icon: 'fast-food-outline',
      direction: 'root',
      isLogin:true
    },
    {
      title: 'Contactanos',
      url: '/contact', 
      icon: 'mail-outline',
      direction: 'root',
      isLogin:true
    },
    {
      title: 'Términos y Condiciones',
      url: '/terms',
      icon: 'shield-checkmark-outline',
      direction: 'forward',
      isLogin:false
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  @ViewChild('menu', { static: true }) menu: IonMenu;


  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString("#813182");
      this.splashScreen.hide();
      this.authService.getToken().then(() => {
      },
      err=>{
      });    
    });
  }

  ngOnInit() {
    // const path = window.location.pathname;
    // if (path !== undefined) {
    //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    // }
  }

  logout(){
    this.authService.logout();
    this.navCtrl.navigateRoot('/home');
    this.menu.toggle(true);
  }

  login(){
    this.navCtrl.navigateForward(['/login']);
    this.menu.toggle(true);
  } 
 
  register(){ 
    this.navCtrl.navigateForward(['/register']);
    this.menu.toggle(true);
  }

  account(){ 
    this.navCtrl.navigateForward(['/account']);
    this.menu.toggle(true);
  }
}
