import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController,  AlertController  } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { FoodsApi } from '../../services/api/foods.api';
import { Foods } from '../../models/Foods';
import { ImageCacheService } from '../../services/image-cache.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera  } = Plugins;

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.page.html',
  styleUrls: ['./products-add.page.scss'],
})
export class ProductsAddPage implements OnInit {

  @ViewChild('myTextarea', {static:true}) myTextarea: ElementRef;
  id:any;
  food:Foods = new Foods();

  image1:any = this.imageCache.imgFood;
  image2:any = null;
  image3:any = null;

  constructor(
    private route: ActivatedRoute, 
    private navCtrl:NavController,
    private loadingCtrl:LoadingController,
    private authService:AuthService,
    private alertService:AlertService,
    private alertCtrl:AlertController,
    private foodsApi:FoodsApi,
    private imageCache: ImageCacheService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if( this.id == "add" ){
      this.food['created_by'] = this.authService.token.userId;
      this.food.active = 1;
    }else
      this.loadDetails();
  }

  async loadDetails(){
    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    this.foodsApi.foodId( this.id, { sort:"-created_at", expand:"active,image2,image3" } ).subscribe( data => {
      this.food = data;
      delete this.food.id;
      delete this.food.star;
      delete this.food.cant_comments;
      delete this.food.updated_at;
      delete this.food.is_favorite;

      this.imageCache.transform( this.food.image1, "food" ).then( newUrl => {
        this.image1 = newUrl;
        loading.dismiss();
      }, err => loading.dismiss());

      if( this.food.image2 ){
        this.imageCache.transform( this.food.image2, "food" ).then( newUrl => {
          this.image2 = newUrl;
        });
      }
      
      if( this.food.image3 ){
        this.imageCache.transform( this.food.image3, "food" ).then( newUrl => {
          this.image3 = newUrl;
        });
      }
    },
    err=>{
      loading.dismiss();
      this.dismiss();
      this.alertService.presentToast("Error cargando los datos");
    },
    () => {

    })
  }

  dismiss(){
    this.navCtrl.back();
  }

  background(img){
    return {
      "background-image" : "url("+ img +")",
      "background-repeat": "no-repeat",
      "background-position": "center",
      "background-size": "cover",
    }; 
  }

  action(form){
    if( this.id == "add" )
      this.create();
    else
      this.edit();
  }

  async create(){
    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    this.updateImage();
    this.foodsApi.create( this.food, {fields:'id'} ).subscribe( data => {
      this.navCtrl.back();
      loading.dismiss();
      this.alertService.presentToast("Producto creado exitosamente");
    },
    err=> {
      loading.dismiss();
      this.alertService.presentToast("Error creando el producto");
    }, 
    () => {

    });
  }

  async edit(){
    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    this.updateImage();
    this.foodsApi.edit( this.id, this.food, {fields:'id'} ).subscribe( data => {
      this.navCtrl.back();
      loading.dismiss();
      this.alertService.presentToast("Producto editado exitosamente");
    },
    err=> {
      loading.dismiss();
      this.alertService.presentToast("Error editando el producto");
    }, 
    () => {

    });
  }

  onDeleteImg(item){
    if( item == 1 ){
      this.image1 = this.image2;
      this.image2 = this.image3;
      this.food.image1 = this.food.image2;
      this.food.image2 = this.food.image3;
    }else
      if( item == 2 ){
        this.image2 = this.image3;
        this.food.image2 = this.food.image3;
      }

    this.image3 = null;
    this.food.image3 = null;

    if( !this.image1 ) this.image1 = this.imageCache.imgFood;
  }

  updateImage(){
    if( this.image3 && this.image3.match(/^data:image/) )
      this.food.image3 = this.image3;
    if( this.image2 && this.image2.match(/^data:image/) )
      this.food.image2 = this.image2;
    if( this.image1 && this.image1.match(/^data:image/) )
      this.food.image1 = this.image1;
  }

  selectSaveImg(img){
    if( !this.image1 || this.image1 == this.imageCache.imgFood )
      this.image1 = img;
    else 
    if( !this.image2 )
      this.image2 = img;
    else
      this.image3 = img;
  }

  onGallery(){
    this.onPhoto(CameraSource.Photos);
  }

  onCamera(){
    this.onPhoto(CameraSource.Camera);
  }

  onPhoto(source){
    if( this.image3 ){
      this.alertService.presentToast("Una producto puede tener a lo más 3 imagenes");
      return;
    }

    Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      correctOrientation:true,
      saveToGallery:true,
      source:source,
    }).then( image => {
      this.selectSaveImg(image.dataUrl);
    } ).catch( err => {} );
  }

  resizeTextarea(){
    this.myTextarea.nativeElement.style.height = this.myTextarea.nativeElement.scrollHeight + 'px';
  }

  async delete(){
    const alert = await this.alertCtrl.create({
      message: 'Seguro que deseas eliminar la publicación',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteFoods();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteFoods(){
    let loading = await this.loadingCtrl.create( { message:"Eliminando" } )
    await loading.present();
    this.foodsApi.delete( this.id ).subscribe( data => {
      this.navCtrl.back();
      loading.dismiss();
      this.alertService.presentToast("El producto ha sido eliminado");
    },
    err=> {
      loading.dismiss();
      this.alertService.presentToast("Error eliminado el producto");
    }, 
    () => {

    });
  }
}
