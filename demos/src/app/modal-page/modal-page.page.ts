import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  @Input() value:number;

  constructor(public modalController : ModalController) { }

  closeModal(){
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
