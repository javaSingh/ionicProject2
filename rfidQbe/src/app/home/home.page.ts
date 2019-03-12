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


// npm i ionic4-date-picker --save

import * as XLSX from 'xlsx';
// npm i --save xlsx

import { saveAs } from 'file-saver';
import { removeSummaryDuplicates } from '@angular/compiler';
// npm i file-saver

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isSearching: boolean = false

  formGroup: FormGroup
  results: any[] = []
  index
  // owners = ['ECOR', 'ECR', 'SCR', 'SR']
  owners = ["CR",
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

  assetsType = ["#", "A", "e", "C", "D", "E", "F", "L", "M", "P", "R", "S", "X", "Y", "Z"]

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
      }, {
        text: 'Done',
        handler: ((data) => {
          console.log('Clicked Save! Data is: ')
          console.log(data)
          console.log(data.month.value.length)
          if (data.month.value < 10) {
            console.log('Single Digit Month Found')
            data.month.value = '0' + data.month.value
            console.log('After padding', data.month.value)
          }
          if (data.day.value < 10) {
            console.log('Single Digit Day Found')
            data.day.value = '0' + data.day.value
            console.log('After padding', data.day.value)
          }
          console.log('' + data.year.value + '-' + data.month.value + '-' + data.day.value)
          this.formGroup.controls['dateUse'].setValue('' + data.year.value + '-' + data.month.value + '-' + data.day.value)
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
    /*     console.log('Date:', new Date('adfadfasdfadfasdf'))
        // Date: Invalid Date
        console.log(new Date('2019-04-31').toISOString().slice(0, 10))
        if (new Date('2019-04-31').toISOString().slice(0, 10) === '2019-04-31') {
          console.log('match found')
        }
        else {
          console.log('match not found')
        } */
  }

  ngOnInit() {
    console.log('ngOnInit')
    this.formGroup = this.fb.group({
      "invalidDateRange": [''],
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

    // this.presentAlertRadio()
  }

  customValidator(formGroup: FormGroup) {

    var atLeastOneIsFilled: boolean = false

    /*     if (formGroup.controls['yearOfManufacture']) {
          if (formGroup.controls['yearOfManufacture'].value.match('[0,9]{1,2}') !== null && formGroup.controls['yearOfManufacture'].value !== '') {
            formGroup.controls['yearOfManufacture'].setErrors({ incorrect: true })
          }
        } */


    if (formGroup.controls['dateUse'].value !== '') {
      if (formGroup.controls['dateUse'].value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        //pattern is matching. 
        //date maybe invalid like 50 Jan or 32 MMM
        //date is jumping like 31 apr is treated as 1 may
        if (new Date(formGroup.controls['dateUse'].value) + '' !== 'Invalid Date') {
          //date is valid like 30 apr or 31 apr or 31 Feb
          if (new Date(formGroup.controls['dateUse'].value).toISOString().slice(0, 10) !== formGroup.controls['dateUse'].value) {
            // 31 Feb jumps to march
            // for js, 30 Apr is valid. Also 31 Apr is valid but presented as 1 May. ie date jumps
            formGroup.controls['dateUse'].setErrors({ incorrect: true })
            console.log('Invalid Date: Date is Jumping.')
            formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
          }
          // date is not jumping
          else {
            // valid pattern and valid date and no jumps
            console.log('Pattern Matched. Valid Date. No Jumps.')
          }
        }
        else {
          //date is invalid eg 50 Feb
          formGroup.controls['dateUse'].setErrors({ incorrect: true })
          console.log('Invalid Date: Value like 32 Jan/50 Mar.')
          formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
        }
      }
      else {
        //pattern not matching
        formGroup.controls['dateUse'].setErrors({ incorrect: true })
        console.log('Invalid Date: Format other than YYYY-MM-DD.')
        formGroup.controls['invalidDateRange'].setErrors(null)
      }
    }






    /*     if (formGroup.controls['dateUse'].value !== '') {
          if (formGroup.controls['dateUse'].value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.log('Pattern match')
            if (new Date(formGroup.controls['dateUse'].value) + '' !== 'Invalid Date') {
              if (new Date(formGroup.controls['dateUse'].value).toISOString().slice(0, 10) === formGroup.controls['dateUse'].value) {
                console.log('match found')
              }
              else {
                console.log('match not found')
                formGroup.controls['dateUse'].setErrors({ incorrect: true })
              }
            }
            else {
              console.log('Invalid Date')
              formGroup.controls['dateUse'].setErrors({ incorrect: true })
              formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
            }
          }
          else {
            console.log('Pattern not match')
            formGroup.controls['dateUse'].setErrors({ incorrect: true })
            formGroup.controls['invalidDateRange'].setErrors(null)
          }
        } */

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
    this.isSearching = true

    //0 padding for serial number
    var map = ['00000', '0000', '000', '00', '0']
    if (this.formGroup.controls['serialNo']) {
      if (this.formGroup.controls['serialNo'].value.length < 6 && this.formGroup.controls['serialNo'].value !== '') {
        console.log('Before padding:', this.formGroup.controls['serialNo'].value)
        console.log('serial no length:', this.formGroup.controls['serialNo'].value.length)
        this.formGroup.controls['serialNo'].setValue(map[this.formGroup.controls['serialNo'].value.length - 1] + this.formGroup.controls['serialNo'].value)
      }
      console.log('After padding:', this.formGroup.controls['serialNo'].value)
    }



    var jsonData = this.formGroup.value
    console.log('Form Value as String:',JSON.stringify(this.formGroup.value))
    Object.keys(jsonData).forEach(k => (!jsonData[k] && jsonData[k] !== undefined) && delete jsonData[k]);
    console.log('Form value as string:',JSON.stringify(this.formGroup.value))
    /*     if (jsonData['yearOfManufacture']) {
          console.log(jsonData['yearOfManufacture'].substring(2, 4))
          jsonData['yearOfManufacture'] = jsonData['yearOfManufacture'].substring(2, 4)
        } */
    console.log(jsonData)



    let timeoutPromise = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Connection Timed Out');
      }, 3000)
    })

    let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value), { reportProgress: true }).toPromise()

    let race = Promise.race([timeoutPromise, responsePromise])
    race.then((data: any) => {
      console.log('Race Response: ', data)
      if (data === 'Connection Timed Out') {
        console.log(data)
        this.presentToast('Unable to Connect now.')
      }
      else {
        console.log('response has win the race')
        console.log('HTTP GET Result: ', data)
        this.results = data
        if (this.results.length > 0) {
          this.showResults(0)
          this.removeDuplicates()
        }
        else {
          this.presentToast('No Result Found')
        }
      }
    }, error => {
      console.log("Error: ")
      console.log(error)
      this.presentToast('Unable to Connect.')
    }).finally(() => {
      this.isSearching = false
    })


    /*     subscribe((data: any[]) => {
          console.log('HTTP GET Result: ', data)
          this.results = data
          if (this.results.length > 0)
            this.showResults(0)
          else {
            this.presentToast('No Result Found')
          }
        }, error => {
          console.log('HTTP GET ERROR: ', error)
          // this.presentToast('')
        }) */

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
    var inputs = []
    if (key === 'owner') {
      console.log('Owner Select')
      inputs = this.makeRadioSelectList(key, this.owners)
      header = 'Owner'
    }
    else if (key === 'vehicleType') {
      console.log('Vehicle Type Select')
      inputs = this.makeRadioSelectList(key, this.vehiclesType)
      header = 'Vehicle Type'
    }
    else if (key === 'vehicleCode') {
      console.log('Vehicle Type Select')
      inputs = this.makeRadioSelectList(key, this.manufacturersCode)
      header = 'Manufacture Code'
    }
    else if (key === 'assetType') {
      console.log('Asset Type Select')
      inputs = this.makeRadioSelectList(key, this.assetsType)
      header = 'Asset Type'
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

  clearForm() {
    this.results = []
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


  showQuerySummary() {
    var message = 'Asset '
    var map = {
      assetType: ' of type ',
      yearOfManufacture: ', manufactured on ',
      owner: ', owned by ',
      vehicleType: ', of vehicle type ',
      serialNo: ', having serial number ',
      dateUse: ', put into use on ',
      vehicleCode: ', manufactured  by ',
    }
    Object.keys(this.formGroup.value).forEach(k => {
      if (this.formGroup.controls[k].value !== '') {
        message += map[k] + this.formGroup.controls[k].value
      }
    })
    message=message.split(' , ').join(' ')
    this.presentQuerySummary(message + '.')
  }

  async presentQuerySummary(message) {

    const alert = await this.alertController.create({
      header: 'Query Summary',
      message: message,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });

    await alert.present();
  }


  type = 'string'
  fromInfinite: CalendarComponentOptions = {
    from: new Date(1),
    to: 0
  }

  onChange($event) {
    console.log('On Change:', $event);
    // this.openCalendar()
  }

  defaultDate = new Date(new Date().toISOString().slice(0, 10))

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Date Use',
      canBackwardsSelected: true,
      autoDone: true,
      // defaultDate: this.defaultDate,
      // defaultScrollTo:this.defaultDate
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    console.log('Date Value:', date.string);
    this.formGroup.controls['dateUse'].setValue('' + date.string)
    /*     if (date.string != undefined || date.string !== '')
          this.defaultDate = new Date(date.string) */
  }

  showDateUseCalendar() {
    if (this.formGroup.controls['dateUse'].value === '')
      this.openCalendar()
  }

  //https://github.com/HsuanXyz/ion2-calendar


  makeExcel() {
    console.log('Download Start' + new Date())
    let sheet = XLSX.utils.json_to_sheet(this.results);
    // let sheet = XLSX.utils.json_to_sheet(this.testArr);
    let wb = {
      SheetNames: ["export"],
      Sheets: {
        "export": sheet
      }
    };
    let wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });

    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, "Output.xlsx");
    console.log('Download End' + new Date())
  }

  someClick() {
    console.log('Some click.')
  }

  doukeypress(e) {
    console.log(e)
  }


  removeDuplicates() {
    console.log('Removing Duplicates')
    var uniqueResults = []
    var found:boolean = false
    Object.keys(this.results).forEach(k => {
      // console.log('results item:', this.results[k])
      Object.keys(uniqueResults).forEach(m => {
        // console.log('uniqueResult item:', uniqueResults[m])
        if (JSON.stringify(this.results[k]) === JSON.stringify(uniqueResults[m])) {
          found = true
        }
        else {
          found = false
        }
      });
      if (!found) {
        uniqueResults.push(this.results[k])
      }
    });
    console.log(uniqueResults)
    this.results=uniqueResults


    /*
     assetType: ' of type ',
    yearOfManufacture: ' manufactured on ',
    owner: ' owned by ',
    vehicleType: ' vehicle type ',
    serialNo: ' having serial number ',
    dateUse: ' put into use on ',
    vehicleCode: ' manufactured  by ',








    (4) [{…}, {…}, {…}, {…}]
    0: asset_type: "F"date_use: "2029-07-17"gs1_code: 8907709owner: "ECOR"serial_no: "003927"vehicle_mfc_code: "ARC"vehicle_type: "BOXNHL"year_of_manufacture: 17__proto__: 
    Object1: asset_type: "F"date_use: "2017-08-10"gs1_code: 8907709owner: "ECR"serial_no: "001141"vehicle_mfc_code: "BURH"vehicle_type: "BRN22.9"year_of_manufacture: 17__proto__: 
    Object2: asset_type: "F"date_use: "2017-08-31"gs1_code: 8907709owner: "SR"serial_no: "001087"vehicle_mfc_code: "BURH"vehicle_type: "BRN22.9"year_of_manufacture: 17__proto__: 
    Object3: asset_type: "F"date_use: "2017-10-25"gs1_code: 8907709owner: "SCR"serial_no: "001031"vehicle_mfc_code: "BURH"vehicle_type: "BRN22.9"year_of_manufacture: 17__proto__: 
    Objectlength: 4__proto__: Array(0)

     */

  }



}
