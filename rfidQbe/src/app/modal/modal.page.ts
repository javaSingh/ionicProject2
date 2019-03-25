import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult, CalendarComponentOptions } from 'ion2-calendar';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() value: any;
  @Input() queryString: any;
  @Input() type: string
  @Input() title: string
  @Input() dateUseLessThan: string
  @Input() dateUseMoreThan: string

  dateUseRange = ''
  dateUseFrom = ''
  dateUseTo = ''
  manufacturedBefore = ''
  manufacturedAfter = ''

  map = {
    assetType: ' type is ',
    yearOfManufacture: ' which was manufactured on ',
    yearOfManufactureLessThan: ' which was manufactured before ',
    yearOfManufactureMoreThan: ' which was manufactured after ',
    owner: ' which is owned by ',
    vehicleType: ' which is of type ',
    serialNo: " having serial number ",
    dateUse: ' which was put into use on ',
    dateUseLessThan: ' which was put into use before ',
    dateUseMoreThan: ' which was put into use after ',
    vehicleMfcCode: ' manufactured by ',
  }

  messageArray = []

  constructor(public modalController: ModalController, public navParams: NavParams, public modalCtrl: ModalController) {
    var message = ''
    console.log('Modal constructor:', navParams.data)
    console.log(navParams.data.dateUseLessThan)
    console.log(navParams.data.dateUseMoreThan)
    console.log(new Date('' + navParams.data.dateUseLessThan + ''))
    console.log(new Date('' + navParams.data.dateUseMoreThan + ''))
    console.log(new Date('' + navParams.data.dateUseLessThan + '') < new Date('' + navParams.data.dateUseMoreThan + ''))
    console.log(new Date('' + navParams.data.dateUseLessThan + '') > new Date('' + navParams.data.dateUseMoreThan + ''))
    if (navParams.data.dateUseLessThan !== ''
      && navParams.data.dateUseMoreThan !== ''
      && new Date('' + navParams.data.dateUseLessThan + '') > new Date('' + navParams.data.dateUseMoreThan + '')) {
      console.log('setting Range as well')
      this.dateUseRange = navParams.data.dateUseMoreThan + ' - ' + navParams.data.dateUseLessThan
    }

    Object.keys(navParams.data.queryString).forEach(k => {
      message = ''

      if (navParams.data.queryString[k].length > 0) {
        if (k === 'yearOfManufactureLessThan') {
          message += this.map[k]
          message += navParams.data.queryString[k]
          message = "Asset " + message + '.'
          this.messageArray.push(message)
        }
        else if (k === 'yearOfManufactureMoreThan') {
          message += this.map[k]
          message += navParams.data.queryString[k]
          message = "Asset " + message + '.'
          this.messageArray.push(message)
        }
        /*         else if (k === 'yearOfManufactureLessThan') {
                  message += this.map[k]
                  message += navParams.data.queryString[k]
                }
                else if (k === 'yearOfManufactureMoreThan') {
                  message += this.map[k]
                  message += navParams.data.queryString[k]
                } */
        else if (k !== 'serialNo' && !k.match('dateUse')) {
          message = this.map[k]
          // console.log(message)
          for (var i = 0; i < navParams.data.queryString[k].length; i++) {
            message += navParams.data.queryString[k][i].name
            // console.log(message)
            if (navParams.data.queryString[k].length > 1 && i < navParams.data.queryString[k].length - 1) {
              message += ' OR '
            }

          }
          message = "Asset " + message + '.'
          this.messageArray.push(message)
        }
        else {
          message = this.map[k] + navParams.data.queryString[k]
          // console.log(message)
          message = "Asset " + message + '.'
          this.messageArray.push(message)
        }
      }
    })

  }

  closeModal() {
    console.log('closing Modal')
    if (this.dateUseLessThan !== ''
      && this.dateUseMoreThan !== ''
      && new Date(this.dateUseLessThan) > new Date(this.dateUseMoreThan)) {
      console.log('Invalid Dates From : To')
    }
    this.modalController.dismiss(
      {
        dateUseLessThan: this.dateUseLessThan,
        dateUseMoreThan: this.dateUseMoreThan,
        dateUseFrom: this.dateUseFrom,
        dateUseTo: this.dateUseTo,
        manufacturedBefore:this.manufacturedBefore,
        manufacturedAfter:this.manufacturedAfter
      }
    );
  }

  ngOnInit() {
  }

  async openCalendarRange(k, title) {
    const options: CalendarModalOptions = {
      title: title,
      canBackwardsSelected: true,
      autoDone: true,
      pickMode: 'range'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: any = event.data;
    if (date != null) {
      console.log('Date Put into use Range value:', date)
      this.dateUseRange = date.from.string + " - " + date.to.string
      this.dateUseFrom = date.from.string
      this.dateUseTo = date.to.string
    }
  }


  async openCalendar(k, title) {
    const options: CalendarModalOptions = {
      title: title,
      canBackwardsSelected: true,
      autoDone: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    if (date != null) {
      console.log('Date Value for:', date.string);
      if (k === 'dateUseLessThan') {
        this.dateUseLessThan = date.string
      }
      else if (k === 'dateUseMoreThan') {
        this.dateUseMoreThan = date.string
      }
    }
  }

  clearDate(k) {
    console.log('Clearing Date')
    if (k === 'dateUseMoreThan') {
      console.log('Clearing Date Use More Than')
      this.dateUseMoreThan = ''
    }
    if (k === 'dateUseLessThan') {
      console.log('Clearing Date Use Less Than')
      this.dateUseLessThan = ''
    }
    if (k === 'dateUseRange') {
      console.log('Clearing Date Use Range')
      this.dateUseRange = ''
    }
  }

  resetValues() {
    console.log('Resetting Values in Modal')
    this.dateUseMoreThan = ''
    this.dateUseLessThan = ''
    this.dateUseRange = ''
    this.dateUseFrom = ''
    this.dateUseTo = ''
  }

  clearManufactureYear(k) {
    if (k === 'manufacturedBefore') {
      this.manufacturedBefore = ''
    }
    if (k === 'manufacturedAfter') {
      this.manufacturedAfter = ''
    }
    if (k === 'both') {
      this.clearManufactureYear('manufacturedBefore')
      this.clearManufactureYear('manufacturedAfter')
    }
  }

}
