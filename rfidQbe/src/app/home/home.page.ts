import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';

import { HttpProvider } from '../providers/http/http'

// npm i ionic4-date-picker --save

import * as XLSX from 'xlsx';
// npm i --save xlsx

import { saveAs } from 'file-saver';
// npm i file-saver


import { IonicSelectableComponent } from 'ionic-selectable'

class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  ports: Port[];
  years: string[] = []
  port: Port;

  // ?filter={"where":{"or":[{"owner":"ECOR"},{"owner":"ECR"}]}}

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
    "WCR", "WR"]

  // vehiclesType=['BRN22.9','BOXNHL']
  vehiclesType = ["BCNHL",
    "BFNS",
    "BOBRNHSM1",
    "BOBSN",
    "BOBYN",
    "BOSTHSM2",
    "BOXNHL",
    "BOXNS",
    'BRN22.9',
    "BTPGLN",
    "BVCM",
    "BVZI",]

  // manufacturersCode = ['ARC', 'BURN']
  manufacturersCode = ["ARC", "ASRW", "BESF", "BESWL", "BESWR", "BUR", "BWELK", "BWELZ", "BWT", "CIM", "CLW", "DLW", "DMW", "GOCW", "HEIB", "HEIS", "ICFW", "JMPW", "JRIL", "JWL", "MCFW", "MI", "OFPL", "RCFW", "SPJW", "SR", "TEXB", "TEXS", "TWL",]

  assetsType = ["#", "A", "C", "D", "E", "F", "L", "M", "P", "R", "S", "X", "Y", "Z"]
  assetsTypeExpanded = ["Condemned Vehicle",
    "Ancillary vehicles, i.e., non-earning vehicles necessary for train operations",
    "g., Guard Vans in freight, Generator Cars in coaching",
    "Coaching (Passenger Carrying ONLY)",
    "DEMU",
    "EMU",
    "Freight (Earning vehicles ONLY)",
    "Electric Locos",
    "Maintenance related vehicles, e.g., Tower cars",
    "Not revealed, e.g., Defense",
    "Part, i.e., an assembly/ subassembly, e.g., LHB bogie",
    "Rescue and safety related Vehicles, e.g., SPART/ SPARME, Cranes etc",
    "Diesel Locos",
    "Experimental, Vehicles on trial, e.g., the Talgo rake",
    "Departmental (Freight)",
    "Departmental (Coaching) includes saloons"
  ]

  //ion date time/datetime/date-time custom option to implement clear which is not present in default
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
        //clearing dateUse
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

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
    console.log('Before Assign:', this.formGroup.value)
    var meraVar = this.formGroup.value
    console.log('After Assign:', meraVar)
    meraVar = ''
    console.log('After Deletion', this.formGroup.value)
this.makeQueryFromFormValue()
    // console.log(JSON.parse(query))

    /*    console.log('FC:',this.formGroup.controls['yearOfManufacture'].value)
       var arr=['17']
       this.formGroup.controls['yearOfManufacture'].setValue(arr)
       console.log('FC after set value:',this.formGroup.controls['yearOfManufacture'].value) */
    /*     for(var i=0;i<event.value.length;i++){
          event.value[i]=event.value[i].substring(2,4)
        }
        console.log('after:',event.value) */
  }



 makeQueryFromFormValue() {
    var query = ''
    // {"or":[{"owner":"[ECOR]"},{"owner":"ECR"}]}
    Object.keys(this.formGroup.value).forEach(k => {
      console.log('Inside forEach')
      if (this.formGroup.controls[k].value !== '') {
        // console.log('inside value !=="" if condition')
        if (k !== 'serialNo') {
          // console.log('inside k !=="serianNo" if condition')
          if (this.formGroup.controls[k].value.length > 1) {
            // console.log('multiple valued array found')
            query += '{"or":['
          }
          for (var i = 0; i < this.formGroup.controls[k].value.length; i++) {
            // console.log('inside query making for loop')
            query += '{"' + k + '":"' + this.formGroup.controls[k].value[i] + '"},'
          }
          if (this.formGroup.controls[k].value.length > 1) {
            // console.log('multiple valued array found')
            query += ']}'
          }
        }
      }

    })

    query += '.'
    query = query.split('},.').join('}')
    query = query.split(',]}.').join(']}')
    // {"yearOfManufacture":"2018"},{"yearOfManufacture":"2016"},{"yearOfManufacture":"2014"}
    // {"yearOfManufacture":"2018"}
    console.log(query)
  }
  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public httpProvider: HttpProvider
  ) {

    var yyToyyyy = []


    console.log(yyToyyyy)
    console.log('Constructor')

    for (var i = 2019; i > 1969; i--) {
      var year = i + ''
      this.years.push(year)
    }


    this.ports = [
      { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' }, { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' },
      { id: 3, name: 'Navlakhi' }
    ];



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
      'yearOfManufacture': [''
        // ,[Validators.pattern('[0-9]{1,4}'), Validators.min(0), Validators.max(9999)]
      ]
      ,
      'yearOfManufactureArray': [''],
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
    console.log('Form Value as String:', JSON.stringify(this.formGroup.value))
    Object.keys(jsonData).forEach(k => (!jsonData[k] && jsonData[k] !== undefined) && delete jsonData[k]);
    console.log('Form value as string:', JSON.stringify(this.formGroup.value))
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

    let responsePromise = this.httpProvider.getMethod('/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value)).toPromise()

    // let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value), { reportProgress: true }).toPromise()

    let race = Promise.race([timeoutPromise, responsePromise])
    race.then((data: any) => {
      console.log('Race Response: ', data)
      if (data === 'Connection Timed Out') {
        console.log(data)
        this.presentToast('Unable to Connect now.')
      }
      else {
        // console.log('response has win the race')
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
    // this.formGroup.controls['yearOfManufacture'].setValue("" + this.results[0].year_of_manufacture)
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
      inputs = this.makeRadioSelectList(key, this.owners, [])
      header = 'Owner'
    }
    else if (key === 'vehicleType') {
      console.log('Vehicle Type Select')
      inputs = this.makeRadioSelectList(key, this.vehiclesType, [])
      header = 'Vehicle Type'
    }
    else if (key === 'vehicleCode') {
      console.log('Vehicle Type Select')
      inputs = this.makeRadioSelectList(key, this.manufacturersCode, [])
      header = 'Manufacture Code'
    }
    else if (key === 'assetType') {
      console.log('Asset Type Select')
      inputs = this.makeRadioSelectList(key, this.assetsType, this.assetsTypeExpanded)
      header = 'Asset Type'
    }
    this.presentAlertRadio(header, inputs, key)
  }

  makeRadioSelectList(key, array, expandedArray) {
    var inputs = []
    for (var i = 0; i < array.length; i++) {
      var option = {
        type: 'checkbox', label: expandedArray[i], value: array[i]
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
      'yearOfManufacture': [''
        // ,[Validators.pattern('[0-9]{1,4}'), Validators.min(0), Validators.max(9999)]
      ],
      'yearOfManufactureArray': [''],
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
    message = message.split(' , ').join(' ')
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


  /*   type = 'string'
    fromInfinite: CalendarComponentOptions = {
      from: new Date(1),
      to: 0
    } */

  /*   onChange($event) {
      console.log('On Change:', $event);
      // this.openCalendar()
    } */

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Date Use',
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
    console.log('Date Value:', date.string);
    this.formGroup.controls['dateUse'].setValue('' + date.string)
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

  removeDuplicates() {
    console.log('Removing Duplicates')
    var uniqueResults = []
    var found: boolean = false
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
    this.results = uniqueResults


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
