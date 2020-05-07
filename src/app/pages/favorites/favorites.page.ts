import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { FoodsApi } from '../../services/api/foods.api';
import { Foods } from '../../models/Foods';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  subscription:any;
  params: any;
  foods: Array<Foods> = null;
  limit = 10;

  constructor(
    private platform: Platform,
    private navCtrl:NavController,
    private alertService:AlertService,
    private foodsApi:FoodsApi,
  ) { }

  ngOnInit() {
    this.params = {
      page: 1,
      "per-page": this.limit,
    };

    this.update();
  }

  update( target=null, load=false ){
    this.foodsApi.favorite( this.params ).subscribe( 
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

  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
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
      this.foods = this.foods.filter( x => x.id != item.id);
    },
     err=> {
      this.alertService.presentToast(err.message);
     }, 
     () => {});    
  }

  onSwipeRight(item){
    console.log(item);
  }

}
