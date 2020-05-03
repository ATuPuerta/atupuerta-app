import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { FoodsApi } from '../../services/api/foods.api'
import { Foods } from 'src/app/models/Foods';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  subscription:any;

  constructor(
    private platform: Platform,
    private navCtrl:NavController,
    private foodsApi:FoodsApi,
    private alertService:AlertService,
    private authService:AuthService,
  ) { }

  @ViewChild('slidesCat', { static: true }) slidesCat: IonSlides;
  onSearch:boolean = false;
  params: any;
  foods: any = null;
  limit = 10;

  slideHomeOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop:true
  };

  slideCategoriasOpts = {
    initialSlide: 0,
    slidesPerView: 3
  };

  styleCatActive = { "box-shadow": "1px 1px 5px 1px #feb92f"};

  categorias = [
    {
      title:"Filete",
      style:{}
    },
    {
      title:"Pizza",
      style:{}
    },
    {
      title:"Pollo",
      style:{}
    }
  ]

  auth:any;

  ngOnInit() {
      this.auth = this.authService.isLoggedInSubject.subscribe( data => { 
          if( data ){
            this.iniPage();
          }
      } )
      this.iniPage();
  }

  ngOnDestroy(){
    this.auth.unsubscribe();
  }

  iniPage(  ){
    this.foods = null;
    this.params = {
      page: 1,
      "per-page": this.limit,
      sort:"-id"
    };

    this.update();
  }

  ionViewWillEnter() {
  }


  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

  update( target=null, load=false ){
    this.foodsApi.foods( this.params ).subscribe( 
      data => {
        if( this.foods == null ) 
          this.foods = data;
        else
          this.foods = this.foods.concat(data);

        this.params.page += 1;
        if( load && data.length <= 0 ) target.disabled = true;
      },
      err => {
        this.alertService.presentToast("Error de conexión");
      }, 
      () => {
        if( target ) target.complete();
      });
  }

  background(){
    return {
      "background-image" : "url(./assets/img/prueba3.png)",
      "background-repeat": "no-repeat",
      "background-position": "center",
      "background-size": "cover",
    };
  }

  backgroundCat(item){
    return {
      "background-image" : "url(./assets/img/prueba"+item+".png)"
    };
  }


  slideCatPrev(){
    this.slidesCat.slidePrev();
  }

  slideCatNext2(){
    this.slidesCat.slideNext();
  }

  onClickCat(titleCat){
    this.categorias = this.categorias.map( x => { 
      x.style = ( x.title == titleCat && x.style != this.styleCatActive )?this.styleCatActive:{}; 
      console.log
      return x; 
    });

    let sel = this.categorias.filter( x => x.style != {} );
  }

  onClickProduct(item){
    this.navCtrl.navigateForward(['/details/'+item.id]);
  }

  doRefresh(event){
    this.params.page = 1;
    this.params["per-page"] = this.limit,
    this.foods = null;
    this.update(event.target);
  }  

  loadData(event){
    this.update(event.target, true);
  }  

  onClickCardTop(){
    // this.navCtrl.navigateForward(['/cart']);
  }

  onSwipeLeft(item){
    this.foodsApi.changeFav( item.id ).subscribe( data => {
      this.foods = this.foods.map( x => { 
          x.is_favorite = (x.id != item.id)? x.is_favorite : !x.is_favorite 
          return x;
        });
    },
     err=> {
      this.alertService.presentToast(err.message);
     }, 
     () => {});    
  }

  onSwipeRight(item){
    this.alertService.presentToast("Añadido al Carrito: ToDo");
  }
}
