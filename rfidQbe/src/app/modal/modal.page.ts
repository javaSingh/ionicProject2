import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() value:any;
  @Input() queryString:any;

   map = {
    assetType: ' Asset Type ',
    yearOfManufacture: ' Asset was manufactured on ',
    owner: ' Asset is owned by ',
    vehicleType: ' Vehicle is of type ',
    serialNo: " Asset serial number is ",
    dateUse: ' Asset was put into use on ',
    vehicleMfcCode: 'Asset is manufactured by ',
  }
  messageArray=[]

  constructor(public modalController : ModalController, public navParams:NavParams) { 
    var message=''
    console.log('Modal constructor:',navParams.data)
    Object.keys(navParams.data.queryString).forEach(k => {
      if (navParams.data.queryString[k].length > 0) {
        if (k !== 'serialNo' && k !== 'dateUse') {
          message = this.map[k]
          // console.log(message)
          for (var i = 0; i < navParams.data.queryString[k].length; i++) {
            message += navParams.data.queryString[k][i].name
            // console.log(message)
            if (navParams.data.queryString[k].length > 1 && i < navParams.data.queryString[k].length - 1) {
              message += ' OR '
            }
            
          }
          this.messageArray.push(message)
        }
        else {
          message = this.map[k] + navParams.data.queryString[k]
          // console.log(message)
          this.messageArray.push(message)
        }
      }
    })
  }

  closeModal(){
    console.log('closing Modal')
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
