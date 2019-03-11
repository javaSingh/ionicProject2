import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import {
    CalendarModal,
    CalendarModalOptions,
    DayConfig,
    CalendarResult
  } from 'ion2-calendar';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  formGroup: FormGroup
  results: any[] = []
  index
  // owners = ['ECOR', 'ECR', 'SCR', 'SR']
  owners =     ["CR",
  "ECOR",
  "ECR",
  "ER",
  "KR",
  "NCR",
  "NER",
  "NFR",
  "NR",
  "NWR",
  "SCR",
  "SECR",
  "SER",
  "SR",
  "SWR",
  "WCR",
  "WR"]

  // vehiclesType=['BRN22.9','BOXNHL']
  vehiclesType = ["BOXNHL", "BCNHL", "BOXNS", "BOSTHSM2", "BOBYN", "BOBSN", "BTPGLN", "BFNS", "BVCM", "BVZI", "BOBRNHSM1"]
  // manufacturersCode = ['ARC', 'BURN']
  manufacturersCode = ["ARC", "ASRW", "BESF", "BESWL", "BESWR", "BUR", "BWELK", "BWELZ", "BWT", "CIM", "CLW", "DLW", "DMW", "GOCW", "HEIB", "HEIS", "ICFW", "JMPW", "JRIL", "JWL", "MCFW", "MI", "OFPL", "RCFW", "SPJW", "SR", "TEXB", "TEXS", "TWL",]

  assetsType=["#", "A", "e", "C", "D", "E", "F", "L", "M", "P", "R", "S", "X", "Y", "Z"]

  public customOptions: any = {
    buttons: [
      {
        text: 'Cancel',
        handler: () => {
          console.log('Dismiss.');
          return true;
        }
      },
      {
        text: 'Clear',
        handler: () => this.formGroup.controls['dateUse'].setValue('')
      },{
      text: 'Done',
      handler: ((data) => {
        console.log('Clicked Save! Data is: ')
        console.log(data)
        console.log(data.month.value.length)
        if(data.month.value<10){
          console.log('Single Digit Month Found')
          data.month.value='0'+data.month.value
          console.log('After padding',data.month.value)
        }
        if(data.day.value<10){
          console.log('Single Digit Day Found')
          data.day.value='0'+data.day.value
          console.log('After padding',data.day.value)
        }
        console.log(''+data.year.value+'-'+data.month.value+'-'+data.day.value)
        this.formGroup.controls['dateUse'].setValue(''+data.year.value+'-'+data.month.value+'-'+data.day.value)
      })
    },]
  }

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
    public modalCtrl: ModalController
  ) {
    console.log('Constructor')
  }

  ngOnInit() {
    console.log('ngOnInit')
    this.formGroup = this.fb.group({

      'assetType': [''],
      'yearOfManufacture': ['',
        [Validators.pattern('[0-9]{1,2}'), Validators.min(0), Validators.max(99)]],
      'owner': [''],
      'vehicleType': [''],
      'serialNo': [''
        , [Validators.pattern('[0-9]{6}'), Validators.min(0), Validators.max(999999)]
      ],
      'dateUse': [''],
      'vehicleCode': [''],
    }, {
        validator: this.customValidator
      });

    // this.presentAlertRadio()
  }

  customValidator(formGroup: FormGroup) {

    var atLeastOneIsFilled: boolean = false

    if(formGroup.controls['yearOfManufacture']){
        if(formGroup.controls['yearOfManufacture'].value.match('[0,9]{1,2}')!==null && formGroup.controls['yearOfManufacture'].value!==''){
            formGroup.controls['yearOfManufacture'].setErrors({ incorrect: true })
        }
    }

    for (var key in formGroup.controls) {
      if (formGroup.controls[key].value && formGroup.controls[key].value.length > 0) {
        console.log('ValidForm. AtLeastOneIsFilled. Breaking')
        atLeastOneIsFilled = true
        break
      }
    }

    if (atLeastOneIsFilled) {
      console.log("ValidForm")
      return null
    }
    else {
      console.log('InvalidForm')
      return { valid: false }
    }
  }

  onSubmit() {
    console.log(this.formGroup.value, this.formGroup.valid)
    var jsonData = this.formGroup.value
    console.log(JSON.stringify(this.formGroup.value))
    Object.keys(jsonData).forEach(k => (!jsonData[k] && jsonData[k] !== undefined) && delete jsonData[k]);
    console.log(JSON.stringify(this.formGroup.value))
    /*     if (jsonData['yearOfManufacture']) {
          console.log(jsonData['yearOfManufacture'].substring(2, 4))
          jsonData['yearOfManufacture'] = jsonData['yearOfManufacture'].substring(2, 4)
        } */
    console.log(jsonData)

    this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value), { reportProgress: true }).subscribe((data: any[]) => {
      console.log('HTTP GET Result: ', data)
      this.results = data
      /*           this.formGroup.patchValue({
                  assetType:[this.results[0].asset_type.value]
                }) */
      if (this.results.length > 0)
        this.showResults(0)
      else {
        this.presentToast('No Result Found')
      }
    }, error => {
      console.log('HTTP GET ERROR: ', error)
      // this.presentToast('')
    })

  }

  showResults(index: any) {
    console.log('Showing Reults. Index is: ', index)
    this.index = index
    console.log(this.results[0].year_of_manufacture)
    this.formGroup.controls['assetType'].setValue('' + this.results[index].asset_type)
    this.formGroup.controls['yearOfManufacture'].setValue("" + this.results[0].year_of_manufacture)
    this.formGroup.controls['owner'].setValue('' + this.results[index].owner)
    this.formGroup.controls['vehicleType'].setValue('' + this.results[index].vehicle_type)
    this.formGroup.controls['serialNo'].setValue('' + this.results[index].serial_no)
    this.formGroup.controls['dateUse'].setValue('' + this.results[index].date_use)
    this.formGroup.controls['vehicleCode'].setValue('' + this.results[index].vehicle_mfc_code)

    /* asset_type: "F"
date_use: "2029-07-17"
gs1_code: 8907709
owner: "ECOR"
serial_no: "003927"
vehicle_mfc_code: "ARC"
vehicle_type: "BOXNHL"
year_of_manufacture: 17 */

  }

  showPrevious() {
    console.log('Showing Previous')
    this.showResults(this.index - 1)
  }

  showNext() {
    console.log("Showing Next")
    this.showResults(this.index + 1)
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      translucent: false,
      showCloseButton: true,
      closeButtonText: 'CLOSE',
      duration: 1500,
      position: "top"
    });
    toast.present();
  }

  clearSelection(key) {
    console.log('Inside clearSelection(' + key + ')')
    if (this.formGroup.controls[key].value) {
      console.log('Select value Found for', key)
    }
  }

  /*   customAlertOptions: any = {
      header: 'Owner',
      translucent: true,
    }; */


  async presentAlertRadio(header, inputs: any[], key) {

    const alert = await this.alertController.create({
      header: header,
      // message: '<div style="overflow-y:auto;max-height:240px;"></div>',
      inputs: inputs
      /*       [
              {
                name: 'radio1',
                type: 'radio',
                label: 'Radio 1',
                value: 'value1',
                checked: true
              },
              {
                name: 'radio2',
                type: 'radio',
                label: 'Radio 2',
                value: 'value2'
              },
              {
                name: 'radio3',
                type: 'radio',
                label: 'Radio 3',
                value: 'value3'
              },
              {
                name: 'radio4',
                type: 'radio',
                label: 'Radio 4',
                value: 'value4'
              },
              {
                name: 'radio5',
                type: 'radio',
                label: 'Radio 5',
                value: 'value5'
              },
              {
                name: 'radio6',
                type: 'radio',
                label: 'Radio 6',
                value: 'value6'
              }
            ], */
      ,
      buttons: [
        /* {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel',data);
          }
        }, */
        {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data != undefined)
              this.formGroup.controls[key].setValue('' + data)
          }
        }, {
          text: 'Clear',
          handler: (data) => {
            console.log('Confirm Clear', data);
            this.formGroup.controls[key].setValue('')
          }
        }
      ]
    });

    await alert.present();
  }

  openSelect(key) {
    var header
    var inputs=[]
    if (key === 'owner') {
      console.log('Owner Select')
       inputs = this.makeRadioSelectList(key, this.owners)
      header='Owner'
    }
    else if (key === 'vehicleType') {
      console.log('Vehicle Type Select')
       inputs = this.makeRadioSelectList(key, this.vehiclesType)
      header='Vehicle Type'
    }
    else if(key==='vehicleCode'){
      console.log('Vehicle Type Select')
       inputs = this.makeRadioSelectList(key, this.manufacturersCode)
      header='Manufacture Code'
    }
    else if(key==='assetType'){
      console.log('Asset Type Select')
       inputs = this.makeRadioSelectList(key, this.assetsType)
      header='Asset Type'
    }
    this.presentAlertRadio(header, inputs, key)
  }

  makeRadioSelectList(key, array) {
    var inputs = []
    for (var i = 0; i < array.length; i++) {
      var option = {
        type: 'radio', label: array[i], value: array[i]
      }
      if (this.formGroup.controls[key].value && this.formGroup.controls[key].value !== '' && this.formGroup.controls[key].value === array[i]) {
        option['checked'] = true
      }
      console.log(option)
      inputs.push(option)
    }
    return inputs;

  }

  clearForm(){
  this.results=[]
    this.formGroup = this.fb.group({
      'assetType': [''],
      'yearOfManufacture': ['',
        [Validators.pattern('[0-9]{1,2}'), Validators.min(0), Validators.max(99)]],
      'owner': [''],
      'vehicleType': [''],
      'serialNo': [''
        , [Validators.pattern('[0-9]{1,6}'), Validators.min(0), Validators.max(999999)]
      ],
      'dateUse': [''],
      'vehicleCode': [''],
    }, {
        validator: this.customValidator
      });

  }


  numberOnly(event): boolean {
    console.log('Keypress Event: ')
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  showQuerySummary(){

  }


  type='string'
  fromInfinite:CalendarComponentOptions={
      from : new Date(1),
      to : 0
  }

  onChange($event) {
    console.log($event);
    this.openCalendar()
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Date Use',
      canBackwardsSelected:true,
      autoDone:true
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    console.log(date.string);
  }

  showDateUseCalendar(){
      this.openCalendar()
  }

  //https://github.com/HsuanXyz/ion2-calendar
  


}
