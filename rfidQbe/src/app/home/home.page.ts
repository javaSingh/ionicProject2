import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult, CalendarComponentOptions } from 'ion2-calendar';

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
  yearsMapping = []
  port: Port;

  // ?filter={"where":{"or":[{"owner":"ECOR"},{"owner":"ECR"}]}}

  isSearching: boolean = false

  formGroup: FormGroup
  validFormCustomStatus = false
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

  vehiclesTypeMapping = [
    { id: "BCNA", name: "BCNA" },
    { id: "BCNHL", name: "BCNHL" },
    { id: "BFNS", name: "BFNS" },
    { id: "BLCB", name: "BLCB" },
    { id: "BOBRNHSM1", name: "BOBRNHSM1" },
    { id: "BOBSN", name: "BOBSN" },
    { id: "BOBYN", name: "BOBYN" },
    { id: "BOBYNHS", name: "BOBYNHS" },
    { id: "BOSTHSM2", name: "BOSTHSM2" },
    { id: "BOXNHA", name: "BOXNHA" },
    { id: "BOXNHL", name: "BOXNHL" },
    { id: "BOXNHS", name: "BOXNHS" },
    { id: "BOXNS", name: "BOXNS" },
    { id: "BRN22.9", name: "BRN22.9" },
    { id: "BTPGLN", name: "BTPGLN" },
    { id: "BVCM", name: "BVCM" },
    { id: "BVZI", name: "BVZI" }
  ]

  // manufacturersCode = ['ARC', 'BURN']
  manufacturersCode = ["ARC", "ASRW", "BESF", "BESWL", "BESWR", "BUR", "BWELK", "BWELZ", "BWT", "CIM", "CLW", "DLW", "DMW", "GOCW", "HEIB", "HEIS", "ICFW", "JMPW", "JRIL", "JWL", "MCFW", "MI", "OFPL", "RCFW", "SPJW", "SR", "TEXB", "TEXS", "TWL",]

  manufacturersCodeMapping = [
    { id: "ARC", name: "Amtek Railcar Industries Pvt. Ltd." },
    { id: "ASRW", name: "Amritsar Workshop   " },
    { id: "BESF", name: "BESCO Ltd (Foundry), Kolkata " },
    { id: "BESWL", name: "BESCO Ltd. (Wagon), Kolkata " },
    { id: "BESWR", name: "BESCO Ltd (Wagon), Kolkata " },
    { id: "BUR", name: "Burn Standard Co. Ltd. " },
    { id: "BURH", name: "BUR Howrah" },
    { id: "BWELK", name: "Bharat Wagon & Engineering Ltd." },
    { id: "BWELZ", name: "Bharat Wagon & Engineering Ltd." },
    { id: "BWT", name: "Braithwate & Co. Ltd., Kolkata" },
    { id: "CIM", name: "CIMMCO Ltd, Bharatpur  " },
    { id: "CLW", name: "Chittaranjan Locomotive Works  " },
    { id: "DLW", name: "Diesel Locomotive Works  " },
    { id: "DMW", name: "Diesel Loco Modernisation Works " },
    { id: "GOCW", name: "Golden Rock Workshop, Trichurapalli " },
    { id: "HEIB", name: "Hindustan Engineering Industries Ltd., Kolkata" },
    { id: "HEIS", name: "Hindustan Engineering Industries Ltd., Kolkata" },
    { id: "ICFW", name: "Integral Coach factory  " },
    { id: "JMPW", name: "Jamalpur Workshop   " },
    { id: "JRIL", name: "Jindal Rail Infrastructure Ltd, Vadodara Miyagam " },
    { id: "JWL", name: "Jupiter Wagons Ltd, Chinsura, Hoogly" },
    { id: "MCFW", name: "Modern Coach Factory  " },
    { id: "MI", name: "Modern Industries (UP)  " },
    { id: "OFPL", name: "Oriental Foundry Pvt Ltd " },
    { id: "RCFW", name: "Rail Coach Factory  " },
    { id: "SPJW", name: "Samastipur Workshop   " },
    { id: "SR", name: "Sail RITES Bengal Wagon Industry Pvt. Ltd." },
    { id: "TEXB", name: "Texmaco Rail and Engineering Ltd., Kolkata " },
    { id: "TEXS", name: "Texmaco Rail and Engineering Ltd., Kolkata " },
    { id: "TWL", name: "Titagarh, Howrah" },



  ]

  assetsType = ["#", "A", "C", "D", "E", "F", "L", "M", "P", "R", "S", "X", "Y", "Z"]
  assetsTypeExpanded = [
    "Condemned Vehicle",
    "Ancillary vehicles, i.e., non-earning vehicles necessary for train operations e.g., Guard Vans in freight, Generator Cars in coaching",
    "Coaching (Passenger Carrying ONLY)",
    "DEMU",
    "EMU",
    "Freight (Earning vehicles ONLY)",
    "Electric Locos",
    "Maintenance related vehicles, e.g., Tower cars",
    "Part, i.e., an assembly/ subassembly, e.g., LHB bogie",
    "Rescue and safety related Vehicles, e.g., SPART/ SPARME, Cranes etc",
    "Diesel Locos",
    "Experimental, Vehicles on trial, e.g., the Talgo rake",
    "Departmental (Freight)",
    "Departmental (Coaching) includes saloons"
  ]

  assetsTypeMapping = [
    { id: "#", name: "Condemned Vehicle" },
    { id: "A", name: "Ancillary vehicles, i.e., non-earning vehicles nec…Guard Vans in freight, Generator Cars in coaching" },
    { id: "C", name: "Coaching (Passenger Carrying ONLY)" },
    { id: "D", name: "DEMU" },
    { id: "E", name: "EMU" },
    { id: "F", name: "Freight (Earning vehicles ONLY)" },
    { id: "L", name: "Electric Locos" },
    { id: "M", name: "Maintenance related vehicles, e.g., Tower cars" },
    { id: "P", name: "Part, i.e., an assembly/ subassembly, e.g., LHB bogie" },
    { id: "R", name: "Rescue and safety related Vehicles, e.g., SPART/ SPARME, Cranes etc" },
    { id: "S", name: "Diesel Locos" },
    { id: "X", name: "Experimental, Vehicles on trial, e.g., the Talgo rake" },
    { id: "Y", name: "Departmental (Freight)" },
    { id: "Z", name: "Departmental (Coaching) includes saloons" },
  ]


  ownersMapping = [
    { id: "CR", name: "CR" },
    { id: "ECOR", name: "ECOR" },
    { id: "ECR", name: "ECR" },
    { id: "ER", name: "ER" },
    { id: "KR", name: "KR" },
    { id: "NCR", name: "NCR" },
    { id: "NER", name: "NER" },
    { id: "NFR", name: "NFR" },
    { id: "NR", name: "NR" },
    { id: "NWR", name: "NWR" },
    { id: "SCR", name: "SCR" },
    { id: "SECR", name: "SECR" },
    { id: "SER", name: "SER" },
    { id: "SR", name: "SR" },
    { id: "SWR", name: "SWR" },
    { id: "WCR", name: "WCR" },
    { id: "WR", name: "WR" }
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
        //what if done without selecting any ?
        //autoDone is set as true. hence. Done will never be called unless the date is selected 
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


  yomChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('YOM Change Event:', event.value);
    this.lessThan = ''
    this.moreThan = ''
    this.formGroup.controls['yearOfManufactureLessThan'].setValue('')
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue('')
  }



  makeQueryFromFormValue() {

    var query = '{'
    var query2 = '{'
    var dateUseSet: boolean = false

    Object.keys(this.formGroup.value).forEach(k => {
      if (this.formGroup.controls[k].value !== '') {
        if (k !== 'serialNo' && !k.match('dateUse')) {
          if (this.formGroup.controls[k].value.length > 1) {
            query += '"or":['
            query2 += '"' + k + '":{"inq":['
            for (var i = 0; i < this.formGroup.controls[k].value.length; i++) {
              query += '{"' + k + '":"' + this.formGroup.controls[k].value[i].id + '"},'
              query2 += '"' + this.formGroup.controls[k].value[i].id + '"'
            }
            query += ']'
            query2 += ']}'

          }
          else if (this.formGroup.controls[k].value[0] != undefined) {
            console.log(this.formGroup.controls[k].value[0].id)
            query += '"' + k + '":"' + this.formGroup.controls[k].value[0].id + '",'
            query2 += '"' + k + '":"' + this.formGroup.controls[k].value[0].id + '",'
          }
          else if (k === 'yearOfManufacture') {
            console.log('k=YOM and value is ', this.formGroup.controls[k].value)
            if (this.lessThan !== '' && this.moreThan !== '') {
              // "yearOfManufacture":{"gt": 18, "lt": 19},"
              query += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2, 4) + '","lt":"' + this.lessThan.substring(2, 4) + '"},'
              query2 += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2, 4) + '","lt":"' + this.lessThan.substring(2, 4) + '"},'
            }
            else if (this.lessThan === '' && this.moreThan !== '') {
              query += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2.4) + '"},'
              query2 += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2.4) + '"},'
            }
            else if (this.moreThan === '' && this.lessThan !== '') {
              query += '"yearOfManufacture":{"lt":"' + this.lessThan.substring(2.4) + '"},'
              query2 += '"yearOfManufacture":{"lt":"' + this.lessThan.substring(2.4) + '"},'
            }
          }

        }
        else if (this.formGroup.controls[k].value != undefined) {
          console.log(this.formGroup.controls[k].value)
          if (k === 'serialNo') {
            query += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
            query2 += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
          }
          else if (!dateUseSet) {
            if (this.formGroup.controls['dateUseLessThan'].value !== '' && this.formGroup.controls['dateUseMoreThan'].value !== '') {
              // "yearOfManufacture":{"gt": 18, "lt": 19},"
              query += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '","lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              query2 += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '","lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              dateUseSet = true;
            }
            else if (this.formGroup.controls['dateUseLessThan'].value === '' && this.formGroup.controls['dateUseMoreThan'].value !== '') {
              query += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '"},'
              query2 += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '"},'
              dateUseSet = true;
            }
            else if (this.formGroup.controls['dateUseMoreThan'].value === '' && this.formGroup.controls['dateUseLessThan'].value !== '') {
              query += '"dateUse":{"lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              query2 += '"dateUse":{"lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              dateUseSet = true;
            }
            else if (k === 'dateUse') {
              query += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
              query2 += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
              dateUseSet = true;
            }
          }
        }
      }
    })

    query += '}'
    query2 += '}.'

    query += '.'
    console.log('Before Split:', query)
    query = query.split(',]"').join('],"')
    query = query.split('},.').join('}')
    query = query.split(',]}.').join(']}')
    query = query.split(',]').join(']')
    query = query.split(',}.').join('}')
    query = query.split(']"').join('}')
    // {"yearOfManufacture":"2018"},{"yearOfManufacture":"2016"},{"yearOfManufacture":"2014"}
    // {"yearOfManufacture":"2018"}
    console.log('After Split:', query)

    console.log('Query2 Before Split', query2)
    query2 = query2.split('""').join('","')
    query2 = query2.split('}"').join('},"')
    query2 = query2.split(',}.').join('}')
    query2 = query2.split('}.').join('}')
    console.log('Query2 After Split', query2)
    return query2
  }


  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public httpProvider: HttpProvider
  ) {

    // this.presentModal('Called from Constructor')

    /* var vehiclesMapping=[]
        for(var i=0;i<this.owners.length;i++){
          vehiclesMapping.push({'id':this.vehiclesType[i],'name':this.vehiclesType[i]})
        }
        console.log(vehiclesMapping) */

    var yyToyyyy = []


    console.log(yyToyyyy)
    console.log('Constructor')


    //making of yearsMapping. Should not be commented.
    for (var i = 2019; i > 1969; i--) {
      var year = i + ''
      this.yearsMapping.push({ id: (i + '').substring(2, 4), name: '' + i })
    }
    // console.log(this.yearsMapping)


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

    this.formInit()
    // this.presentAlertRadio()
  }

  formInit() {
    var arr = []
    this.formGroup = this.fb.group({
      'yearOfManufactureLessThan': [''],
      'yearOfManufactureMoreThan': [''],
      "invalidDateRange": [''],
      'assetType': [arr],
      'yearOfManufacture': [arr
        // ,[Validators.pattern('[0-9]{1,4}'), Validators.min(0), Validators.max(9999)]
      ]
      ,
      'owner': [arr],
      'vehicleType': [arr],
      'serialNo': [''
        , [Validators.pattern('[0-9]{1,6}'), Validators.min(0), Validators.max(999999)]
      ],
      'dateUse': [''],
      'dateUseLessThan': [''],
      'dateUseMoreThan': [''],
      'vehicleMfcCode': [arr],
    },
      {
        validator: this.customValidator.bind(this)
      }
    );
  }


  two() {
    console.log('Two')
  }


  validateDate(formGroup, k) {
    if (formGroup.controls[k].value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      //pattern is matching. 
      //date maybe invalid like 50 Jan or 32 MMM
      //date is jumping like 31 apr is treated as 1 may
      if (new Date(formGroup.controls[k].value) + '' !== 'Invalid Date') {
        //date is valid like 30 apr or 31 apr or 31 Feb
        if (new Date(formGroup.controls[k].value).toISOString().slice(0, 10) !== formGroup.controls[k].value) {
          // 31 Feb jumps to march
          // for js, 30 Apr is valid. Also 31 Apr is valid but presented as 1 May. ie date jumps
          formGroup.controls[k].setErrors({ incorrect: true })
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
        formGroup.controls[k].setErrors({ incorrect: true })
        console.log('Invalid Date: Value like 32 Jan/50 Mar.')
        formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
      }
    }
    else {
      //pattern not matching
      formGroup.controls[k].setErrors({ incorrect: true })
      console.log('Invalid Date: Format other than YYYY-MM-DD.')
      formGroup.controls['invalidDateRange'].setErrors(null)
    }
  }




  customValidator(formGroup: FormGroup) {
    // this.two()

    var atLeastOneIsFilled: boolean = false

    /*     if (formGroup.controls['yearOfManufacture']) {
          if (formGroup.controls['yearOfManufacture'].value.match('[0,9]{1,2}') !== null && formGroup.controls['yearOfManufacture'].value !== '') {
            formGroup.controls['yearOfManufacture'].setErrors({ incorrect: true })
          }
        } */

    if (formGroup.controls['dateUse'].value !== '') {
      this.validateDate(formGroup, 'dateUse')
    }
    if (formGroup.controls['dateUseLessThan'].value !== '') {
      this.validateDate(formGroup, 'dateUseLessThan')
    }
    if (formGroup.controls['dateUseLessThan'].value !== '') {
      this.validateDate(formGroup, 'dateUseLessThan')
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
      if ((formGroup.controls[key].value && formGroup.controls[key].value.length > 0)) {
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
    // this.makeQueryFromFormValue()


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
    console.log('Form value after Shrink:', this.formGroup.value)
    this.querySummaryString = jsonData
    this.formGroup.controls['yearOfManufactureLessThan'].setValue('')
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue('')

    var queryString = this.makeQueryFromFormValue()

    this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
    var fields = ',"fields":{"owner":"true","dateUse":"true","yearOfManufacture":"true","assetType":"true","serialNo":"true","vehicleType":"true","vehicleMfcCode":"true"}'


    console.log('This is query:', '{"where":' + queryString + fields + '}')

    let timeoutPromise = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Connection Timed Out');
      }, 5000)
    })

    // let responsePromise = this.httpProvider.getMethod('/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value)).toPromise()

    // let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value), { reportProgress: true }).toPromise()



    let responsePromise = this.httpProvider.getMethod('/Tags/v2/EPC/qbe?filter=' + '{"where":' + queryString + fields + '}').toPromise()

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
        if (data.name === 'error') {

        } else {
          this.results = data
          if (this.results.length > 0) {
            this.showResults(0)
            this.showDatePutIntoUseFilter = false
            // this.removeDuplicates()
          }
          else {
            this.presentToast('No Result Found')
          }
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


  getItem(mapping, value) {
    var found: boolean = false
    for (var i = 0; i < mapping.length; i++) {
      if (mapping[i].id === value) {
        console.log('Match found', mapping[i])
        found = true
        return [mapping[i]]
      }
    }
    if (!found) {
      console.log('No Match Found. Returning:', [])
      return []
      return [{ id: 'INVALID MAPPING', name: 'INVALID MAPPING' }]
    }

  }
  showResults(index: any) {
    console.log('Showing Reults. Index is: ', index)
    this.index = index
    /* 
        assetType: "F"
    createdBy: "ABCXYZR"
    createdOnClient: "2019-02-12T09:57:38.643Z"
    createdOnServer: "2019-02-12T09:58:38.643Z"
    dateUse: "2029-07-16T18:30:00.000Z"
    dk: "54M0MAJ8"
    gs1Code: "8907709"
    modifiedBy: null
    modifiedOnClient: "2019-02-12T09:57:38.643Z"
    modifiedOnServer: "2019-02-12T09:57:38.643Z"
    owner: "ECOR"
    plNo: "00000000000"
    productSerialNo: "00000000 "
    serialNo: "003927"
    side: "1"
    stages: null
    stationUse: "SDY"
    structureVersion: null
    tagTid: "E2C068922000A1021F0C5617"
    usedFlag: true
    validFlag: false
    vehicleMfcCode: "ARC"
    vehicleType: "BOXNHL"
    version: "D"
    yearOfManufacture: "17" */
    console.log(this.results[0].yearOfManufacture)
    this.formGroup.controls['assetType'].setValue(this.getItem(this.assetsTypeMapping, this.results[index].assetType))
    this.formGroup.controls['yearOfManufacture'].setValue(this.getItem(this.yearsMapping, this.results[index].yearOfManufacture))
    this.formGroup.controls['owner'].setValue(this.getItem(this.ownersMapping, this.results[index].owner))
    this.formGroup.controls['vehicleType'].setValue(this.getItem(this.vehiclesTypeMapping, this.results[index].vehicleType))
    // this.formGroup.controls['serialNo'].setValue()
    this.formGroup.controls['dateUse'].setValue(this.results[index].dateUse.substring(0, 10))

    this.formGroup.controls['vehicleMfcCode'].setValue(this.getItem(this.manufacturersCodeMapping, this.results[index].vehicleMfcCode))

    this.formGroup.controls['serialNo'].setValue(this.results[index].serialNo)
    // this.formGroup.controls['owner'].setValue(this.getItem(this.ownersMapping, this.results[index].owner))



    // this.formGroup.controls['owner'].setValue(owner)

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
    console.log('Current:', this.results[this.index])
    console.log("Previous:", this.results[this.index - 1])
    if (JSON.stringify(this.results[this.index]) === JSON.stringify(this.results[this.index - 1])) {
      console.log("Current and Previous is same.")
      // this.index--
    }
    else {
      console.log("Current and Previous is not the same.")
    }

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
    else if (key === 'vehicleMfcCode') {
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
    var arr = []
    this.moreThan = ''
    this.lessThan = ''
    this.formInit()

  }


  numberOnly(event): boolean {
    console.log('Keypress Event: ')
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  querySummaryString = ''
  showQuerySummary() {
    var queryString = this.querySummaryString
    if (this.querySummaryString !== '') {
      //User has made a search and viewing the query summary
      //here the form value before search is show.
      var formValue = this.formGroup.value
      var result = this.results[this.index]
      var arrayUndefined = false

      //Clearing Form Value of keys where value ===""
      Object.keys(formValue).forEach(k => (!formValue[k] && formValue[k] !== undefined) && delete formValue[k]);

      console.log('Query String:', queryString)
      console.log('From String:', formValue)
      console.log('Result String:', result)

      //flag if any of the formcontrol array is undefined/len<=0
      //this cound happen if user clears form control array after search results is loaded and before hitting the eye
      Object.keys(formValue).forEach(k => {
        if (formValue[k].length <= 0) {
          arrayUndefined = true
        }
      })



      //run check if the user has modified the form after hitting the search button and before hitting eye
      if (!arrayUndefined
        && result.assetType === formValue.assetType[0].id
        && result.yearOfManufacture === formValue.yearOfManufacture[0].id
        && result.owner === formValue.owner[0].id
        && result.vehicleType === formValue.vehicleType[0].id
        && result.dateUse.substring(0, 10) === formValue.dateUse
        && result.vehicleMfcCode.substring(0, 10) === formValue.vehicleMfcCode[0].id
        && parseInt(result.serialNo) === parseInt(formValue.serialNo)
      ) {

        //user has not modified the fields after loading results and before hitting the eye
        //no change in queryString here
        console.log(' ##Match##')
      }
      else {

        //user has  modified the fields after loading results and before hitting the eye
        //point query String to the form value
        console.log(' ##No Match##')
        queryString = formValue
      }
    }
    else {
      queryString = this.formGroup.value
    }


    var message = 'Asset '
    var map = {
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
    Object.keys(queryString).forEach(k => {
      if (queryString[k].length > 0) {
        if (k === 'yearOfManufactureLessThan') {
          message += map[k]
          message += queryString[k]
        }
        else if (k === 'yearOfManufactureMoreThan') {
          message += map[k]
          message += queryString[k]
        }
        else if (k === 'dateUseLessThan') {
          message += map[k]
          message += queryString[k]
        }
        else if (k === 'dateUseMoreThan') {
          message += map[k]
          message += queryString[k]
        }
        else if (k !== 'serialNo' && k !== 'dateUse') {
          message += map[k]
          console.log(message)
          for (var i = 0; i < queryString[k].length; i++) {
            message += queryString[k][i].name
            console.log(message)
            if (queryString[k].length > 1 && i < queryString[k].length - 1) {
              message += ' OR '
            }
          }
        }
        else {
          message += map[k] + queryString[k]
          console.log(message)
        }
      }
    })
    message = message.split(' , ').join(' ')
    // this.presentQuerySummary(message + '.')
    this.presentModal(message, queryString, 'querySummary','Query Summary')
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
      console.log('Date Put into use From:', date.from.string)
      console.log('Date Put into use To:', date.from.string)
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
      console.log('Date Value:', date.string);
      this.formGroup.controls[k].setValue('' + date.string)
    }

  }

  showDateUseCalendar(k) {
    if (this.formGroup.controls[k].value === '') {
      var title = ''
      if (k === 'dateUse') {
        title = 'Date Put Into Use'
      }
      else if (k === 'dateUseLessThan') {
        title = 'Date Put Into Use Before'
      }
      else {
        title = 'Date Put Into Use After'
      }
      this.openCalendar(k, title)
    }
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
    console.log('Start Time:', new Date())
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
    console.log('End Time:', new Date())
  }

  yearOfManufactureFilter() {
    console.log('YOM Filtering')
    this.presentYearOfManufactureFilter()
  }

  showDatePutIntoUseFilter: boolean = false
  enableDatePutIntoUseFilter() {
    console.log('Date Put Into Use Filter')
    if (this.showDatePutIntoUseFilter) {
      this.showDatePutIntoUseFilter = false
    }
    else {
      this.showDatePutIntoUseFilter = true
    }

  }


  lessThan = ''
  moreThan = ''

  async presentYearOfManufactureFilter() {

    const alert = await this.alertController.create({
      header: 'Manufacture Year Filtering',
      // message: 'Format: YYYY',
      inputs: [
        {
          label: 'Before',
          name: 'lessThan',
          type: 'text',
          id: 'name1-id',
          value: this.lessThan,
          placeholder: 'Before YYYY'
        },
        {
          label: 'After',
          name: 'moreThan',
          type: 'text',
          id: 'name2-id',
          value: this.moreThan,
          placeholder: 'After YYYY'
        }],
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');

          }
        }, {
          text: 'Clear',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Clear');
            this.lessThan = ''
            this.moreThan = ''
            this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
            this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log('Data:', data)
            console.log(this.lessThan.match(/^\d{4}$/))
            // match(/^\d{4}$/)
            if (data.lessThan.match(/^\d{4}$/)) {
              if (parseInt(data.lessThan) > 1968 && parseInt(data.lessThan) < 2021) {
                console.log('Match. >1970. <2019')
                this.lessThan = data.lessThan
                this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
              }
            }

            if (data.moreThan.match(/^\d{4}$/)) {
              if (parseInt(data.moreThan) > 1968 && parseInt(data.moreThan) < 2021) {
                console.log('Match. >1970. <2019')
                this.moreThan = data.moreThan
                this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
              }
            }
            if ((this.lessThan === '' && data.lessThan !== '') || (this.moreThan === '' && data.moreThan !== '')) {
              this.presentQuerySummary('Invaild Date Range.')
            }


          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal(message, queryString, type, title) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { value: message, queryString: queryString, type: type, title: title }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Data AFter Moda Close:',data);
    // return await modal.present();

  }

}
