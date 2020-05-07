
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EatItemComponent } from './eat-item/eat-item.component';
import { IonImgCacheComponent } from './ion-img-cache/ion-img-cache.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [EatItemComponent, IonImgCacheComponent, HeaderComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  imports: [
      CommonModule ,
      IonicModule
  ],
  exports: [EatItemComponent, IonImgCacheComponent, HeaderComponent]
})
export class ComponentsModule {}
