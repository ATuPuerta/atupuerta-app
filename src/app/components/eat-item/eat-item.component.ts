import { Component, OnInit,Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-eat-item',
  templateUrl: './eat-item.component.html',
  styleUrls: ['./eat-item.component.scss'],
})
export class EatItemComponent implements OnInit {

  @ViewChild('elem', {static:true}) hostElement: any;
  @ViewChild('div', {static:true}) div: any;
  @ViewChild('iconRight', {static:true}) iconRight: any;
  @ViewChild('iconLeft', {static:true}) iconLeft: any;

  @Input() public item: any;
  @Output() onSwipeLeft: EventEmitter<any> = new EventEmitter();
  @Output() onSwipeRight: EventEmitter<any> = new EventEmitter();

  @Input() textLeft: string = 'textLeft';
  @Input() textRight: string = 'textRight';
  @Input() styleCardContent: any = {};
  limit:number = 90;
  firstLimit:number = 60;
  windowWidth = window.innerWidth;
  deltaX:number = 0;

  constructor(
    private vibration: Vibration,
  ) { }

  ngOnInit() {}


  /// Event Swipe
  panStart(ev){
    // console.log("panStart");
    this.deltaX = 1000000;
    this.hostElement.el.style.transition = "";
    this.hostElement.el.style.transform = "";
    this.div.nativeElement.style.backgroundColor = "white";
    this.iconLeft.el.style.display = "none";
    this.iconRight.el.style.display = "none"; 
    
  }

  panEvent(ev){
    let diff = Math.abs(  ( this.deltaX == 1000000? 0 : this.deltaX ) - ev.deltaX );
    // console.log("ev.deltaY", diff, this.deltaX, ev.deltaX );
    if( diff > 50 || ( this.deltaX == 1000000 && Math.abs(ev.deltaX) < 18 ) ){
      this.deltaX = 1000000;
      this.hostElement.el.style.transform = "";
      this.div.nativeElement.style.backgroundColor = "white";
      this.iconLeft.el.style.display = "none";
      this.iconRight.el.style.display = "none";
      return;
    } 
    
    if( Math.abs(this.deltaX) < this.limit && Math.abs(ev.deltaX) >= this.limit ){
      this.vibration.vibrate(50);
    }

    this.deltaX = ev.deltaX;
    if(ev.deltaX > 0 && this.textLeft != ""){
      this.div.nativeElement.style.backgroundColor = ( Math.abs(ev.deltaX) < this.limit )? "#a8a8a8" : "#eaca2c";  
      this.hostElement.el.style.transform = 'translate3d(' + ev.deltaX + 'px, 0, 0)';
      this.iconLeft.el.style.display = ( Math.abs(ev.deltaX) < this.firstLimit )? "none" : "block";
      this.iconRight.el.style.display = "none";
    }else
      if(ev.deltaX < 0 && this.textRight != ""){
        this.div.nativeElement.style.backgroundColor = ( Math.abs(ev.deltaX) < this.limit )? "#a8a8a8" : "green";  
        this.hostElement.el.style.transform = 'translate3d(' + ev.deltaX + 'px, 0, 0)';
        this.iconLeft.el.style.display ="none";
        this.iconRight.el.style.display = ( Math.abs(ev.deltaX) < this.firstLimit )? "none" : "block";
      }
  }

  panEnd(ev){ 
    if( this.deltaX == 1000000 ){
      return;
    }

    this.deltaX = 1000000;
    // console.log("Start End");
    this.hostElement.el.style.transition = "0.2s ease-out";
    if(ev.deltaX > this.limit && this.textLeft != ""){
      this.hostElement.el.style.transform = 'translate3d(0px, 0, 0)';   
      setTimeout( ()=> {
        this.onSwipeLeft.emit(null);
      }, 150 );  
    } else 
    if(ev.deltaX < -1*this.limit && this.textRight != ""){
      this.hostElement.el.style.transform = 'translate3d(0px, 0, 0)';     
      setTimeout( ()=> {
        this.onSwipeRight.emit(null);
      }, 150 );  
    } 

    this.hostElement.el.style.transform = "";
    this.div.nativeElement.style.backgroundColor = "white";
    this.iconLeft.el.style.display = "none";
    this.iconRight.el.style.display = "none";

  }
  //End Event


  trunDesc( text:string ){
    let maxTam = 60;
    if( !text || text.length < maxTam ) return text;
    return text.substr(0, maxTam-3) + "...";
  }

  styleStar(fontSize, value, i){
    return {
      "font-size": fontSize+"px",
      "color": ( value >= i ) ? "#ffcc00" : "#92949c"
    }
  }
}
