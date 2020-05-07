import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() public buttonBack: boolean;

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {}

  dismiss() {
    this.navCtrl.back();
  }

}
