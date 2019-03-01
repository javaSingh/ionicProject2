import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
// npm i --save xlsx

import { saveAs } from 'file-saver';
// npm i file-saver

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, Platform } from '@ionic/angular';

import { ViewEncapsulation } from '@angular/core';
import { AlertController } from '@ionic/angular';

// import { NGXLogger } from 'ngx-logger';
// npm install --save ngx-logger

import { Storage } from '@ionic/storage'

import { IonInfiniteScroll } from '@ionic/angular';




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
    { prop: 'vehicle_mfc_code', name: 'Vehicle MFC Code' },
    { prop: 'asset_type', name: 'Asset Type' },
    { prop: 'year_of_manufacture', name: 'Year of Manufacture' },
    { prop: 'date_use', name: 'Date put into Use' },
    { prop: 'vehicle_type', name: 'Vehicle Type' },
  ]

  //filtering vars
  itemsAPI = []
  filteredItemsAPI = []
  filterString


  searchedItems = []

  data


  formGroup: FormGroup = null

  uniqueOwnersList = []
  uniqueOwnersMasterList = ["WR", "CR", "ECOR", "ECR", "ER", "KR", "NCR", "NER", "NFR", "NR", "NWR", "SCR", "SECR", "SER", "SR", "SWR", "WCR"]

  uniqueVehiclesCodeList = []

  uniqueVehiclesTypeList = []
  uniqueVehiclesTypeMasterList = ["BOXNHL", "BCNHL", "BOXNS", "BOSTHSM2", "BOBYN", "BOBSN", "BTPGLN", "BFNS", "BVCM", "BVZI", "BOBRNHSM1"]

  uniqueAssetsTypeList = []
  uniqueAssetsTypeMasterList = ["#", "A", "e", "C", "D", "E", "F", "L", "M", "P", "R", "S", "X", "Y", "Z"]
  uniqueVendorCode = []

  uniqueYearsOfManufactureist = []
  uniqueYearsOfManufactureMasterList = ["ARC", "ASRW", "BESF", "BESWL", "BESWR", "BUR", "BWELK", "BWELZ", "BWT", "CIM", "CLW", "DLW", "DMW", "GOCW", "HEIB", "HEIS", "ICFW", "JMPW", "JRIL", "JWL", "MCFW", "MI", "OFPL", "RCFW", "SPJW", "SR", "TEXB", "TEXS", "TWL",]


  locallyStoredQueryAndResultList = []
  /*   locallyStoredQueryAndResultList = [
      {
        query: 'owner=ECOR&', result: [{
          asset_type: "F",
          date_use: "2029-07-17",
          gs1_code: 8907709,
          owner: "ECOR",
          serial_no: "003927",
          vehicle_mfc_code: "ARC",
          vehicle_type: "BOXNHL",
          year_of_manufacture: 17
        }, {
          asset_type: "F",
          date_use: "2029-07-17",
          gs1_code: 8907709,
          owner: "ECOR",
          serial_no: "003927",
          vehicle_mfc_code: "ARC",
          vehicle_type: "BOXNHL",
          year_of_manufacture: 17
        }, {
          asset_type: "F",
          date_use: "2029-07-17",
          gs1_code: 8907709,
          owner: "ECOR",
          serial_no: "003927",
          vehicle_mfc_code: "ARC",
          vehicle_type: "BOXNHL",
          year_of_manufacture: 17
        }]
      }
    ] */

  // queryURL: string = '?filter={"where":{'
  queryURL2: string = ''

  showResults: boolean = false
  userHasCancelled: boolean = false
  showSearchingOverlay: boolean = false
  enableRange: boolean = false
  showDownloadAlert: boolean = true


  hideAtLeastOneMsg() {
    this.userHasCancelled = true
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

  //date picker options customization with clear button and more
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

  }

  showOfflineResult() {
    console.log(this.locallyStoredQueryAndResultList.filter(item => {
      return item.query.indexOf(this.queryURL2) > -1
    }))
    this.searchedItems = this.locallyStoredQueryAndResultList.filter(item => {
      return item.query.indexOf(this.queryURL2) > -1
    })[0].result
    this.showResults = true
    this.showSearchingOverlay = false
    this.queryURL2 = ''
    this.initForm()
  }

  loadData(event) {
    console.log(event)
    setTimeout(() => {
      for (var i = 0; i < 5; i++) {
        var start = new Date().getTime();
        var end = start;
        console.log('Waiting....')
        while (end < start + 1000) {
          end = new Date().getTime();
        }
        console.log(i)
        this.items.push(this.items[i])
      }
      event.target.complete()
    }, 100);
    /*     for(var i=0;i<11;i++){
          // this.items.push(this.items[i])
          setTimeout(()=>{
            this.items.push(this.items[i])
          },1000)
        }
        event.target.complete(); */
    /*     setTimeout(() => {
          console.log('Done');
          // event.target.complete();
          // App logic to determine if all data is loaded
          // and disable the infinite scroll
          if (false) {
            event.target.disabled = true;
          }
        }, 5000); */
  }

  showOnlineResult() {

    let timeoutPromise = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Connection Timed Out');
      }, 3000)
    })

    // let responsePromise = this.http.get('http://http://172.16.22.64:3000/api/v1/RollingAssetRfidData/rfidData?' + this.queryURL2).toPromise()
    // let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/EPC/search?' + this.queryURL2).toPromise()
    let responsePromise = this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?' + this.queryURL2).toPromise()
    this.http.get('http://abc')

    let race = Promise.race([timeoutPromise, responsePromise])
    race.then((data) => {
      if (data === 'Connection Timed Out') {
        console.log(data)
        this.presentToast('Unable to Connect now.')
      }
      else {
        console.log('response has win the race')
        this.data = data
        this.searchedItems = this.data
        this.showResults = true
        console.log(this.searchedItems)
        this.initForm()
        var queryAndResultItem = { query: this.queryURL2, result: this.searchedItems }
        this.locallyStoredQueryAndResultList.push(queryAndResultItem)
        this.storage.set('locallyStoredQueryAndResultList', JSON.stringify(this.locallyStoredQueryAndResultList))
      }
    }, error => {
      console.log("Error: ")
      console.log(error)
      this.presentToast('Unable to Connect.')
    }).finally(() => {
      this.showSearchingOverlay = false
      // this.queryURL = '?filter={"where":{'
      this.queryURL2 = ''
    })
  }

  onSubmit() {
    if (this.showResults) {
      this.showResults = false
      this.searchedItems = []

    } else {
      this.showSearchingOverlay = true
      console.log(this.formGroup.value, this.formGroup.valid);

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
            this.queryURL2 += 'yearOfManufacture=' + this.formGroup.controls[key].value + '&'
          }
          else if (key === 'dateUse') {
            var day = this.formGroup.controls[key].value.day.value
            var month = this.formGroup.controls[key].value.month.value
            var year = this.formGroup.controls[key].value.year.value
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

      // this.queryURL += '}}'
      // this.queryURL = this.queryURL.split('""').join('","')
      // console.log(this.queryURL)
      console.log(this.queryURL2)

      var queryAndResultItem = this.locallyStoredQueryAndResultList.filter(item => {
        return item.query.indexOf(this.queryURL2) > -1;
      })
      if (queryAndResultItem.length > 0) {
        console.log('Local Found. Showing Offline Result')
        this.searchedItems = queryAndResultItem[0].result
        this.showResults = true
        this.showSearchingOverlay = false
        this.queryURL2 = ''
        this.initForm()
      }
      else {
        console.log('Not found in local. Showing Online Result')
        this.showOnlineResult()
      }
    }

  }

  constructor(
    public http: HttpClient,
    public fb: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    public platform: Platform,
    public storage: Storage,
    // private secureStorage: SecureStorage
  ) {
    console.log('Constructor')

    /*     // https://www.w3schools.com/jsref/dom_obj_event.asp
        //browser window/tab close detection
        window.addEventListener('unload', () => {
          localStorage.setItem('unLoadData', 'unload detected')
        });
        //tab/window losing focus detection
        window.addEventListener('blur', () => {
          alert('Blur')
          localStorage.setItem('blurData', 'blur detected')
        })
        // alert(!!window.cordova) */


    this.platform.pause.subscribe((data) => {
      localStorage.setItem('someData', 'platform pause detected')
    })
    this.storage.get('locallyStoredQueryAndResultList').then(data => {
      if (data != null)
        this.locallyStoredQueryAndResultList = JSON.parse(data)
    })
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
    var atLeastOneIsFilled: boolean = false
    var endDateIsWithStartDate: boolean = true
    var rangeUpperValueIsValid: boolean = true
    var ownerLenghtIsValid: boolean = true

    if (formGroup.controls['yearOfManufactureRange'].value.upper === 0) {
      console.log('InvalidForm. Range Is Active and Upper===Lower')
      rangeUpperValueIsValid = false
      formGroup.controls['yearOfManufactureRange'].setErrors({ incorrect: true })
    }

    for (var key in formGroup.controls) {
      if (formGroup.controls[key].value && formGroup.controls[key].value.length > 0) {
        console.log('ValidForm. AtLeastOneIsFilled. Breaking')
        atLeastOneIsFilled = true
        break
      }
    }

    if (formGroup.controls['dateUseRangeEnd'].value !== '' && formGroup.controls['dateUseRangeStart'].value === '') {
      console.log("InvalidForm. End Date is Wihout Start Date.")
      endDateIsWithStartDate = false
      formGroup.controls['dateUseRangeStart'].setErrors({ incorrect: true })
    }

    //if year of man range is invalid and yaer of man is filled then set the range as valid
    if (formGroup.controls['yearOfManufactureRange'].invalid && formGroup.controls['yearOfManufacture'].value.length > 0) {
      console.log('Setting Range as Valid:')
      formGroup.controls['yearOfManufactureRange'].setErrors(null)
      formGroup.controls['yearOfManufactureRange'].setValue('')
    }

    if (atLeastOneIsFilled) {

      if (formGroup.controls['owner'].value.length != 0 && (formGroup.controls['owner'].value.length > 4 || formGroup.controls['owner'].value.length < 2)) {
        ownerLenghtIsValid = false
        console.log('InvalidForm. Owner Length out of range')
        formGroup.controls['owner'].invalid
      }


    }


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
        console.log("ValidForm")
        return null
      }
    }
    console.log('InvalidForm')
    return { valid: false }
  }

  numberOnly(event): boolean {
    console.log('Keypress Event: ')
    console.log(event)
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
      if (data != null) {
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
        this.storage.get('uniqueVehiclesTypeList').then((data) => {
          this.uniqueVehiclesTypeList = JSON.parse(data)
        })
      }
      else {
        // use of master list in case network is down and localStorge is null
        /*         this.uniqueOwnersList=this.uniqueOwnersMasterList
                this.uniqueAssetsTypeList=this.uniqueAssetsTypeMasterList
                this.uniqueVehiclesTypeList =this.uniqueVehiclesTypeMasterList */

        this.getUniqueValues()
      }
    })
  }


  getUniqueValues() {
    var ownerObservable = this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUniqueOwner')
    var ownerSubscription = ownerObservable.subscribe((data: any[]) => {
      console.log("Unique Values from Get: ")
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].owner)
          this.uniqueOwnersList.push(data[i].owner)
      }
      this.storage.set('uniqueOwnersList', JSON.stringify(this.uniqueOwnersList))
    })

    setTimeout(() => {
      ownerSubscription.unsubscribe()
      console.log('Timeout for Get Unique Owners. 3 Sec Timer Expired. Unsubscribed')
    }, 3000);

    this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUniqueAssetType').subscribe((data: any[]) => {
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].asset_type)
          this.uniqueAssetsTypeList.push(data[i].asset_type)
      }
      this.storage.set('uniqueAssetsTypeList', JSON.stringify(this.uniqueAssetsTypeList))
    })

    this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUniqueVehicleType').subscribe((data: any[]) => {
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].vehicle_type)
          this.uniqueVehiclesTypeList.push(data[i].vehicle_type)
      }
      this.storage.set('uniqueVehiclesTypeList', JSON.stringify(this.uniqueVehiclesTypeList))
    })

    this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUniqueVehicleCode').subscribe((data: any[]) => {
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].vehicle_mfc_code)
          this.uniqueVehiclesCodeList.push(data[i].vehicle_mfc_code)
      }
      this.storage.set('uniqueVehiclesCodeList', JSON.stringify(this.uniqueVehiclesCodeList))
    })

    this.http.get('http://172.16.22.64:3000/Tags/EPC/searchUniqueYearOfManufacture').subscribe((data: any[]) => {
      for (var i = 0; i < data.length; i++) {
        console.log('Inside For Loop')
        if (data[i].year_of_manufacture)
          this.uniqueYearsOfManufactureist.push(data[i].year_of_manufacture)
      }
      this.storage.set('uniqueYearsOfManufactureist', JSON.stringify(this.uniqueYearsOfManufactureist))
    })

  }

  initForm() {
    this.formGroup = this.fb.group({
      'owner': [''],
      'vehicleType': [''],
      'serialNo': [''
        , Validators.pattern('[0-9]{6}')
      ],
      'assetType': [''],
      'yearOfManufacture': [''
        , Validators.pattern('[0-9]{1,2}')
      ],
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
