import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Gesture } from '@ionic/core';
import { ChatPage } from '../chat/chat.page';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ImageCacheService } from '../../services/image-cache.service';
import { FoodsApi } from '../../services/api/foods.api';
import { Foods } from 'src/app/models/Foods';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  @ViewChild('myTextarea', {static:true}) myTextarea: ElementRef;

  ionicGesture: Gesture;
  id:any;
  food:Foods = new Foods();
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
  };

  paramsComment:any = {};
  comments:any;
  commentText:any;
  commentLimit = 5;
  commentStar:number = 3;
  favorite:boolean;
  cantidad:number = 1;
  timeAgo:any;

  image1:any = this.imageCache.imgFood;
  image2:any = null;
  image3:any = null;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl: NavController,
    private alertService: AlertService,
    private loadingCtrl:LoadingController,
    private authService: AuthService,
    private foodsApi: FoodsApi,
    private imageCache: ImageCacheService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadDetails();
    this.favorite = true;

    this.paramsComment = {
      "per-page": this.commentLimit,
      page: 1,
      sort:"-updated_at"
    }

    this.iniComments();
  }

  async loadDetails(){
    let loading = await this.loadingCtrl.create( { message:"Cargando" } )
    await loading.present();
    this.foodsApi.foodId( this.id, { expand:"image2,image3,createdBy" } ).subscribe( data => {
      this.food = data;

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
      this.dismissDetails();
      this.alertService.presentToast("Error cargando los datos");
    },
    () => {

    })
  }

  iniComments(target=null){
    this.foodsApi.comments( this.id, this.paramsComment ).subscribe( data => {
      if( this.comments == null )
        this.comments = data;
      else
        this.comments = this.comments.concat( data );
      this.paramsComment.page += 1;
      if( target && data.length <= 0 ) target.disabled = true;
    },
    err=>{
      this.alertService.presentToast("Error cargando los comentarios");
    },
    () => {
      if( target ) target.complete();
    })
  }


  background(img){
    return {
      "background-image" : "url(" + img + ")",
      "background-repeat": "no-repeat",
      "background-position": "center",
      "background-size": "cover",
    };
  }

  dismissDetails() {
    this.navCtrl.back();
  }

  sendComment(){
    if( !this.authService.isLoggedIn ){
      this.alertService.presentToast("Necesitas loguearte para hacer comentarios");
      return;
    }

    let params:any = {
      "text": this.commentText,
      "start": this.commentStar,
      "post_id": this.id
    };
    this.foodsApi.createComments( this.id, params, {"fields": "id,createdBy"} ).subscribe( data => {
      params.updated_at =  new Date();
      params.id =  data.id;
      params.createdBy =  data.createdBy;
      if( this.comments == null )
        this.comments = [params];
      else
        this.comments.unshift( params );
      this.commentText = "";
      this.myTextarea.nativeElement.style.height = '120px';
      this.food.cant_comments = parseInt(this.food.cant_comments);
      this.food.star = ( this.food.star*this.food.cant_comments + params.start)/(this.food.cant_comments+1);
      this.food.cant_comments += 1; 
    },
    err=>{
      this.alertService.presentToast("Error cargando los comentarios");
    },
    () => {
    })
  }

  styleStar(fontSize, value, i){
    return {
      "font-size": fontSize+"px",
      "color": ( value >= i ) ? "#feb92f" : "#92949c"
    }
  }


  async message(){
    // const chatModal = await this.modalController.create({
    //   component: ChatPage,
    //   cssClass: "modalChat",
    //   componentProps: { 
    //     id:5,
    //     isModal:true
    //   }
    // });
    // return await chatModal.present();
  }

  onPan(event){
    console.log(event);
  }

  onFavorite(){
    this.foodsApi.changeFav( this.food.id ).subscribe( data => {
      this.food.is_favorite = !this.food.is_favorite;
    },
     err=> {
      this.alertService.presentToast(err.message);
     }, 
     () => {});    
  }

  loadComments(event){
    this.iniComments(event.target);
  } 

  onClickCardTop(){
    // this.navCtrl.navigateForward(['/cart']);
  }

  addCart(){
    this.alertService.presentToast("Añadido al Carrito: ToDo");
  }

  resizeTextarea(){
    this.myTextarea.nativeElement.style.height = this.myTextarea.nativeElement.scrollHeight + 'px';
  }

  doRefresh(event){
    this.loadDetails()
    event.target.complete()
  }  

  numberPhone(){
    if( !this.food.createdBy ) return ""

    let num = "";

    if( this.food.createdBy.movil_number )
      num = this.food.createdBy.movil_number;

    if( this.food.createdBy.phone_number ){
      if( num != "" ) num += "; ";
      num += this.food.createdBy.phone_number;
    }

      return num;
  }

  whatsapp(){
    if( !this.food || !this.food.createdBy || !this.food.createdBy.movil_number) return "";
    return "https://wa.me/" + this.food.createdBy.movil_number + "?text=Hola, en ATuPuerta he visto su publicación"
  }
}
