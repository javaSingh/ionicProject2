import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform } from '@ionic/angular';

import { ViewEncapsulation } from '@angular/core';
// import { index } from '@swimlane/ngx-datatable/release/'
import { AlertController } from '@ionic/angular';


import { NGXLogger } from 'ngx-logger';
// npm install --save ngx-logger

import { Storage } from '@ionic/storage'


@Component({
  selector: 'app-view-assets',
  templateUrl: './view-assets.page.html',
  styleUrls: ['./view-assets.page.scss'],
  encapsulation: ViewEncapsulation.None
  //swmimlane ngx datatable css will not work well without this.
  // https://stackoverflow.com/questions/44166811/css-issue-ngx-table-angular2-swimlane
})


export class ViewAssetsPage implements OnInit {

  items = [
    { assetType: 'Wheel', yearOfManufacture: '1990', owner: 'Pun', detailedVehicleType: 'Right Front Wheel', serialNumber: '12', datePutIntoUse: '15 May 1990', vendorCode: 'Vdn123' },
    { assetType: 'Headlight', yearOfManufacture: '2000', owner: 'Del', detailedVehicleType: 'Fog lamps', serialNumber: '1612', datePutIntoUse: '17 Sept 2005', vendorCode: 'Vdn113' },
    { assetType: 'Brakes', yearOfManufacture: '1990', owner: 'Ggm', detailedVehicleType: 'Magnetic', serialNumber: '1172', datePutIntoUse: '19 May 1995', vendorCode: 'Vdn133' },
    { assetType: 'Foot Rest', yearOfManufacture: '1990', owner: 'NNL', detailedVehicleType: 'Portable', serialNumber: '1122', datePutIntoUse: '15 Jun  1990', vendorCode: 'Vdn153' },
    { assetType: 'Fan', yearOfManufacture: '1990', owner: 'Dec', detailedVehicleType: 'Usha', serialNumber: '1212', datePutIntoUse: '22 Augh 2003', vendorCode: 'Vdn323' },
    { assetType: 'Seat', yearOfManufacture: '1990', owner: 'Dmv', detailedVehicleType: 'Bucket', serialNumber: '1012', datePutIntoUse: '11 Jan 1990', vendorCode: 'Vdn523' }
  ]
  //

  columns = [
    { prop: 'serial_no', name: 'Serial No.' },
    { prop: 'owner', name: 'Owner' },
    // missing is latest API
    { prop: 'vehicle_mfc_code', name: 'Vehicle MFC Code' },
    { prop: 'asset_type', name: 'Asset Type' },
    { prop: 'year_of_manufacture', name: 'Year of Manufacture' },
    { prop: 'date_use', name: 'Date put into Use' },
    { prop: 'vehicle_type', name: 'Vehicle Type' },
  ]

  /*   bkp_columns = [
      { prop: 'rardOwner', name: 'Owner' },
      { prop: 'rardDetailedVehicleType', name: 'Vehicle Type' },
      { prop: 'rardSerialNo', name: 'Vehicle No.' },
      { prop: 'rardAssetType', name: 'Asset Type' },
      { prop: 'rardYearOfManufacture', name: 'Year of Manufacture' },
      { prop: 'rardDateUse', name: 'Date put into Use' },
      { prop: 'rardVehicleManufacturerCode', name: 'Vendor Code' },
    ] */

  //filtering Vars 
  itemsAPI
  searchedItems = []
  filteredItemsAPI
  data
  filterString
  formGroup: FormGroup = null
  // uniqueOwnersList =['SCR', 'SR', 'ECOR', 'ECR']
  uniqueOwnersList = []
  uniqueVehiclesCodeList = []
  uniqueVehiclesTypeList = []
  uniqueAssetsTypeList = []
  uniqueVendorCode = []
  uniqueYearsOfManufactureist = []
  controlStrings = ['owner',
    // 'rardDetailedVehicleType', 
    'serialNo', 'assetType', 'yearOfManufacture', 'dateUse', 'vehicleType']
  queryURL: string = '?filter={"where":{'
  queryURL2: string = ''

  showResults: boolean = false
  userHasCancelled: boolean = false
  showSearchingOverlay: boolean = false
  enableRange: boolean = false
  showDownloadAlert: boolean = true


  hideAtLeastOneMsg() {
    this.userHasCancelled = true
  }

  tryEncryption() {

    const input = { helo: 'helo jupiter'}

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      translucent: false,
      showCloseButton: true,
      closeButtonText: 'CLOSE',
      duration: 1500
    });
    toast.present();
  }

  public customOptions: any = {
    buttons: [{
      text: 'Done',
      handler: ((data) => {
        console.log('Clicked Save! Data is: ')
        console.log(data)
        this.formGroup.controls['dateUse'].setValue(data)
      })
    }, {
      text: 'Cancel',
      handler: () => {
        console.log('Dismiss.');
        return true;
      }
    }, {
      text: 'Clear',
      handler: () => this.formGroup.controls['dateUse'].setValue('')
    }]
  }

  meraLogger(queryURL: string) {
    console.log('Logging starts here')
    console.log('Timestamp:' + new Date())
    console.log('Platform: ' + this.platform.platforms())
    console.log('QueryURL: ' + queryURL)
    console.log('IP: ')
    // console.log('MAC: ')
    // cannot extract MAC Address
    console.log('Network Speed')
    console.log('Network Type: (Wifi/Lan/Mobile:')
    console.log('Location: (coordinates')
    // this.logger.info('ngx logger')

    /*     this.networkInterface.getWiFiIPAddress().then((address=>{
          console.log(address)
        }))
     */
  }

  onSubmit() {
    if (this.showResults) {
      this.showResults = false
      this.searchedItems = []

    } else {
      this.showSearchingOverlay = true
      console.log(this.formGroup.value, this.formGroup.valid);
      console.log(this.formGroup.controls['yearOfManufacture'].value)

      //Use of Filters. Default API.
      //Between is not working here

      http://172.16.22.64:3000/api/v1/RollingAssetRfidData?filter={"where":{"rardOwner":"asdfdsfa","rardDetailedVehicleType":"sdfadsf","rardSerialNo":"sdfsdf","rardAssetType":"dfasdfa","rardYearOfManufacture":"adfasdfa","rardVehicleManufacturerCode":"fdfadsf"}}

      /*       Object.keys(this.formGroup.controls).forEach(key => {
              if (this.formGroup.controls[key].value) {
                //if range is not empty and field is empty
                if (this.formGroup.controls[key].value.lower != undefined && this.formGroup.controls['rardYearOfManufacture'].value < 1) {
                  // "rardYearOfManufacture":"{between:[30,66]}"
                  this.queryURL += '"rardYearOfManufacture":"{between:[' + this.formGroup.controls[key].value.lower + ',' + this.formGroup.controls[key].value.upper + ']}"'
                }
                else if (key !== 'rardYearOfManufactureRange') {
                  this.queryURL += '"' + key + '":"' + this.formGroup.controls[key].value + '"'
                }
              }
            }); */

      //Custom API. WIP 20 Feb 19
      // http://172.16.22.64:3000/api/v1/RollingAssetRfidData/rfidData?rardOwner=ECR&rardDetailedVehicleType=BRN22.9&rardAssetType=F&rardSerialNo=001153&rardyearOfManufactureStart=16&rardyearOfManufactureEnd=19&rarddateUseStart=2017-07-18&rarddateUseEnd=2017-09-18

      var startDate
      //end date will be current date in case the user decides to ignore the end date
      var endDate = new Date().toISOString().slice(0, 10);

      Object.keys(this.formGroup.controls).forEach(key => {
        if (this.formGroup.controls[key].value) {
          if (this.formGroup.controls[key].value.lower != undefined) {
            if (this.formGroup.controls['yearOfManufacture'].value < 1) {
              this.queryURL2 += 'yearOfManufactureStart=' + this.formGroup.controls[key].value.lower + '&yearOfManufactureEnd=' + this.formGroup.controls[key].value.upper + '&'
            }
          }
          else if (key === 'yearOfManufacture') {
            // this.queryURL2 += 'yearOfManufactureStart=' + this.formGroup.controls[key].value + '&yearOfManufactureEnd=' + this.formGroup.controls[key].value + '&'

            this.queryURL2 += 'yearOfManufacture=' + this.formGroup.controls[key].value + '&'
          }
          else if (key === 'dateUse') {
            var day = this.formGroup.controls[key].value.day.value
            var month = this.formGroup.controls[key].value.month.value
            var year = this.formGroup.controls[key].value.year.value
            // this.queryURL2 += 'dateUseStart=' + year + '-' + month + '-' + day + '&dateUseEnd=' + year + '-' + month + '-' + day + '&'
            this.queryURL2 += 'dateUse=' + year + '-' + month + '-' + day + '&'
          }
          else if (key === 'dateUseRangeStart') {
            if (this.formGroup.controls['dateUse'].value === '') {
              startDate = this.formGroup.controls[key].value
            }
          }
          else if (key === 'dateUseRangeEnd') {
            if (this.formGroup.controls['dateUse'].value === '') {
              endDate = this.formGroup.controls[key].value
            }
          }
          else {
            this.queryURL2 += key + '=' + this.formGroup.controls[key].value + '&'
          }
        }
      });

      if (startDate) {
        this.queryURL2 += 'dateUseStart=' + startDate + '&dateUseEnd=' + endDate + '&'
      }

      this.queryURL += '}}'
      this.queryURL = this.queryURL.split('""').join('","')
      console.log(this.queryURL)
      console.log(this.queryURL2)

      let timeoutPromise = new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve('Connection Timed Out');
        }, 3000)
      })

      // let responsePromise = this.http.get('http://http://172.16.22.64:3000/api/v1/RollingAssetRfidData/rfidData?' + this.queryURL2).toPromise()
      let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/EPC/search?' + this.queryURL2).toPromise()
      this.meraLogger(this.queryURL2)

      let race = Promise.race([timeoutPromise, responsePromise])
      race.then((data) => {
        if (data === 'Connection Timed Out') {
          console.log(data)
          this.presentToast('Unable to Connect now.')
        }
        else {
          console.log('response has win the race')
          this.data = data
          console.log(this.data)
          this.searchedItems = this.data
          this.showResults = true
          this.storage.set('locallyStoredSearchedItems', JSON.stringify(this.searchedItems))
        }
      }, error => {
        console.log("Error: ")
        console.log(error)
        this.presentToast('Unable to Connect.')
      }).finally(() => {
        this.showSearchingOverlay = false
      }
      )
      this.queryURL = '?filter={"where":{'
      this.queryURL2 = ''
    }

    this.initForm()
  }

  constructor(
    public http: HttpClient,
    public fb: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    public platform: Platform,
    private logger: NGXLogger,
    public storage: Storage,
    // private networkInterface: NetworkInterface,
  ) {

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Sure to Download ?',
      // message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah ');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay ');
            this.makeExcel()
          }
        }, {
          text: 'Okay & Never Show Again',
          handler: () => {
            console.log('User Selected Never Show Again')
            this.makeExcel()
            this.showDownloadAlert = false
          }
        }
      ]
    });

    await alert.present();
  }

  startFilter() {
    console.log(this.filterString)
    const filteredItemsAPI = this.itemsAPI.filter((item) => {
      return item.owner.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1 || item.serialNo.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1;
    });
    this.filteredItemsAPI = filteredItemsAPI
  }
  ////

  makeExcel() {
    console.log('Download Start' + new Date())
    let sheet = XLSX.utils.json_to_sheet(this.searchedItems);
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

  meraValidator(formGroup: FormGroup) {

    for (const key in formGroup.controls) {
      if (
        //if any field is filled then it is valid
        !(formGroup.controls[key].value.length < 1)
        &&
        //if range is undef or upper value is 0 then invalid
        !(key === 'yearOfManufactureRange' && (formGroup.controls[key].value.upper === 0 || formGroup.controls[key].value.upper === undefined)
        )

        //if End Date Use is not empty the the Start Date Use should not be empty
        &&
        !(key === 'dateUseRangeEnd' && formGroup.controls[key].value !== '' && formGroup.controls['dateUseRangeStart'].value === '')
        //if owner is not null and min length 2 maxlength 4 then valid
        &&
        !(key === 'owner' && (formGroup.controls[key].value.length > 4 || formGroup.controls[key].value.length < 2))
      ) {
        console.log("returning null. valid form")
        return null
      }
    }

    console.log('returning false. form is not valid')
    return { valid: false }
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    console.log('Init')
    this.initForm()
    this.storage.get('uniqueOwnersList').then((data) => {
      if (data) {
        this.uniqueOwnersList = JSON.parse(data)
        this.storage.get('uniqueAssetsTypeList').then((data) => {
          this.uniqueAssetsTypeList = JSON.parse(data)
        })
        this.storage.get('uniqueVehiclesCodeList').then((data) => {
          this.uniqueVehiclesCodeList = JSON.parse(data)
        })
        this.storage.get('uniqueYearsOfManufactureist').then((data) => {
          this.uniqueYearsOfManufactureist = JSON.parse(data)
        })
      }
      else {
        this.getUniqueValues()
      }
    })
  }

  getUniqueValues() {
    this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUnique').subscribe((data) => {
      console.log("Unique Values from Get: ")
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].owner)
          this.uniqueOwnersList.push(data[i].owner)
        else if (data[i].asset_type)
          this.uniqueAssetsTypeList.push(data[i].asset_type)
        else if (data[i].vehicle_type)
          this.uniqueVehiclesTypeList.push(data[i].vehicle_type)
        else if (data[i].vehicle_code)
          this.uniqueVehiclesCodeList.push(data[i].vehicle_code)
        else if (data[i].year_of_manufacture)
          this.uniqueYearsOfManufactureist.push(data[i].year_of_manufacture)
      }
      this.storage.set('uniqueOwnersList', JSON.stringify(this.uniqueOwnersList))
      this.storage.set('uniqueAssetsTypeList', JSON.stringify(this.uniqueAssetsTypeList))
      this.storage.set('uniqueVehiclesCodeList', JSON.stringify(this.uniqueVehiclesCodeList))
      this.storage.set('uniqueYearsOfManufactureist', JSON.stringify(this.uniqueYearsOfManufactureist))
    })

  }

  initForm() {
    /*     this.formGroup = this.fb.group({
          'rardOwner': [''],
          'rardDetailedVehicleType': [''],
          'rardSerialNo': [''],
          'rardAssetType': [''],
          'rardYearOfManufacture': [''],
          'rardYearOfManufactureRange': [''],
          'rardDateUse': [''],
          'rardDateUseRangeStart': [''],
          'rardDateUseRangeEnd': [''],
          'rardVehicleManufacturerCode': [''],
        }, {
            validator: this.meraValidator
          }) */

    this.formGroup = this.fb.group({
      'owner': [''],
      'vehicleType': [''],
      'serialNo': [''
        , Validators.pattern('[0-9]{6}')
      ],
      'assetType': [''],
      'yearOfManufacture': [''],
      'yearOfManufactureRange': [''],
      'dateUse': [''],
      'dateUseRangeStart': [''],
      'dateUseRangeEnd': [''],
      'vehicleCode': [''],
    }, {
        validator: this.meraValidator
      })

  }
} 
