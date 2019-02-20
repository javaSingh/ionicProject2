import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { ViewEncapsulation } from '@angular/core';
// import { index } from '@swimlane/ngx-datatable/release/'
import { AlertController } from '@ionic/angular';
import { error } from 'util';


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

  columns = [
    { prop: 'rardOwner', name: 'Owner' },
    { prop: 'rardDetailedVehicleType', name: 'Vehicle Type' },
    { prop: 'rardSerialNo', name: 'Vehicle No.' },
    { prop: 'rardAssetType', name: 'Asset Type' },
    { prop: 'rardYearOfManufacture', name: 'Year of Manufacture' },
    { prop: 'rardDateUse', name: 'Date put into Use' },
    { prop: 'rardVehicleManufacturerCode', name: 'Vendor Code' },
  ]

  /*   rows = [
      { name: 'Austin', gender: 'Male', company: 'Swimlane' },
      { name: 'Dany', gender: 'Male', company: 'KFC' },
      { name: 'Molly', gender: 'Female', company: 'Burger King' },
    ]; */
  /*   columns = [
      { prop: 'name' },
      { name: 'Gender' },
      { name: 'Company' }
    ]; */
  itemsAPI
  searchedItems = []
  filteredItemsAPI
  data
  filterString
  formGroup: FormGroup = null
  uniqueOwner = ['PUN', 'DEL', 'NNL', 'DMV', 'SDAH']
  uniqueVehicleType = ['Coach', 'Locomotive', 'Carriage', 'Gurad Van']
  uniqueAssetType = ['Fan', 'Tyre', 'Lock', 'Overhead']
  uniqueVendorCode = ['TCS', 'TM', 'Wipro', 'CRIS', 'Dell']
  uniqueYearOfManufacure = ['2001', '2002', '2018', '2019', '2020']
  controlStrings = ['rardOwner', 'rardDetailedVehicleType', 'rardSerialNo', 'rardAssetType', 'rardYearOfManufacture', 'rardDateUse', 'rardVehicleManufacturerCode']
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

  /*   rangeMoving(){
      console.log('Range Moving')
  console.log(this.formGroup.controls['rardYearOfManufactureRange'].value.upper)
  if(this.formGroup.controls['rardYearOfManufactureRange'].value.upper===this.formGroup.controls['rardYearOfManufactureRange'].value.lower)
  {
    console.log('Lower === Upper')
    this.formGroup.controls['rardYearOfManufacture'].setValue(this.formGroup.controls['rardYearOfManufactureRange'].value.lower)
  }
  
    } */


  public customOptions: any = {
    buttons: [{
      text: 'Done',
      handler: ((data) => {
        console.log('Clicked Save! Data is: ')
        console.log(data)
        this.formGroup.controls['rardDateUse'].setValue(data)
      })
    }, {
      text: 'Cancel',
      handler: () => {
        console.log('Dismiss.');
        return true;
      }
    }, {
      text: 'Clear',
      handler: () => this.formGroup.controls['rardDateUse'].setValue('')
    }]
  }

  onSubmit() {
    if (this.showResults) {
      this.showResults = false
      this.searchedItems = []

    } else {
      this.showSearchingOverlay = true
      console.log(this.formGroup.value, this.formGroup.valid);
      console.log(this.formGroup.controls['rardYearOfManufacture'].value)
      // console.log(this.formGroup.get('rardAssetType').value)
      //Use of Filters
      //between is not working here

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

      // http://172.16.22.64:3000/api/v1/RollingAssetRfidData/rfidData?rardOwner=ECR&rardDetailedVehicleType=BRN22.9&rardAssetType=F&rardSerialNo=001153&rardYearOfManufactureStartDate=16&rardYearOfManufactureEndDate=19&rardDateUseStartDate=2017-07-18&rardDateUseEndDate=2017-09-18
      var startDate
      //end date will be current date in case the user decides to ignore the end date
      var endDate=new Date().toISOString().slice(0,10);
      Object.keys(this.formGroup.controls).forEach(key => {
        /* if (this.formGroup.controls[key].value!=='') {
          //if range is not empty and field is empty
          if (this.formGroup.controls[key].value.lower != undefined && this.formGroup.controls['rardYearOfManufacture'].value < 1) {
            this.queryURL2 += 'rardYearOfManufactureStartDate=' + this.formGroup.controls[key].value.lower + '&rardYearOfManufactureEndDate=' + this.formGroup.controls[key].value.upper + '&'
            // "rardYearOfManufacture":"{between:[30,66]}"
            // this.queryURL += '"rardYearOfManufacture":"{between:[' + this.formGroup.controls[key].value.lower + ',' + this.formGroup.controls[key].value.upper + ']}"'
          }
          else if (key === 'rardYearOfManufacture') {
            this.queryURL2 += 'rardYearOfManufactureStartDate=' + this.formGroup.controls[key].value + '&rardYearOfManufactureEndDate=' + this.formGroup.controls[key].value + '&'
          }
          else if (key === 'rardDateUse') {
            var day = this.formGroup.controls[key].value.day.value
            var month = this.formGroup.controls[key].value.month.value
            var year = this.formGroup.controls[key].value.year.value
            this.queryURL2 += 'rardDateUseStartDate=' + year + '-' + month + '-' + day + '&rardDateUseEndDate=' + year + '-' + month + '-' + day + '&'
          }
          else if (key !== 'rardYearOfManufactureRange' && key !== 'rardYearOfManufacture' && key !== 'rardDateUse') {
            this.queryURL2 += key + '=' + this.formGroup.controls[key].value + '&'
          }

        } */


        // console.log('Inside for with key: '+key)
        if (this.formGroup.controls[key].value) {

          if (this.formGroup.controls[key].value.lower != undefined) {
            if (this.formGroup.controls['rardYearOfManufacture'].value < 1) {
              this.queryURL2 += 'rardYearOfManufactureStartDate=' + this.formGroup.controls[key].value.lower + '&rardYearOfManufactureEndDate=' + this.formGroup.controls[key].value.upper + '&'
            }
          }
          else if (key === 'rardYearOfManufacture') {
            this.queryURL2 += 'rardYearOfManufactureStartDate=' + this.formGroup.controls[key].value + '&rardYearOfManufactureEndDate=' + this.formGroup.controls[key].value + '&'
          }
          else if (key === 'rardDateUse') {
            var day = this.formGroup.controls[key].value.day.value
            var month = this.formGroup.controls[key].value.month.value
            var year = this.formGroup.controls[key].value.year.value
            this.queryURL2 += 'rardDateUseStartDate=' + year + '-' + month + '-' + day + '&rardDateUseEndDate=' + year + '-' + month + '-' + day + '&'
          }
          else if (key === 'rardDateUseRangeStart') {
            if (this.formGroup.controls['rardDateUse'].value === '') {
              // console.log('Setting start Date')
              // startDate = [this.formGroup.controls[key].value.day.value, this.formGroup.controls[key].value.month.value, this.formGroup.controls[key].value.year.value]
              startDate = this.formGroup.controls[key].value
            }
          }
          else if (key === 'rardDateUseRangeEnd') {
            if (this.formGroup.controls['rardDateUse'].value === '') {
              // console.log('Setting end Date')
              // endDate = [this.formGroup.controls[key].value.day.value, this.formGroup.controls[key].value.month.value, this.formGroup.controls[key].value.year.value]
              
              endDate = this.formGroup.controls[key].value
            }
          }
          else {
            this.queryURL2 += key + '=' + this.formGroup.controls[key].value + '&'
          }
        }
      });
      if (startDate) {
        // console.log('Adding the range')
        // this.queryURL2 += 'rardDateUseStartDate=' + startDate[2] + '-' + startDate[1] + '-' + startDate[0] + '&rardDateUseEndDate=' + endDate[2] + '-' + endDate[1] + '-' + endDate[0] + '&'
        this.queryURL2 += 'rardDateUseStartDate=' + startDate + '&rardDateUseEndDate=' + endDate + '&'
      }





      // this.formGroup.reset()
      /*       this.formGroup = this.fb.group(
              {
                'rardOwner': [''],
                'rardDetailedVehicleType': [''],
                'rardSerialNo': [''],
                'rardAssetType': [''],
                'rardYearOfManufacture': [''],
                'rardDateUse': [''],
                'rardVehicleManufacturerCode': [''],
                'yearOfManufactureRange': ['']
              }, { validator: this.meraValidator }
            ) */

      /*       this.formGroup.setValue({
              'rardOwner': [''],
              'rardDetailedVehicleType': [''],
              'rardSerialNo': [''],
              'rardAssetType': [''],
              'rardYearOfManufacture': [''],
              'rardDateUse': [''],
              'rardVehicleManufacturerCode': [''],
              'yearOfManufactureRange': ['']
            }) */
      /* if (this.formGroup.controls['rardAssetType'].value) {
        this.queryURL += '"rardAssetType":"' + this.formGroup.controls['rardAssetType'].value + '"'
      }

      if (this.formGroup.controls['rardYearOfManufacture'].value) {
        this.queryURL += '"rardYearOfManufacture":"' + this.formGroup.controls['rardYearOfManufacture'].value + '"'
      }

      if (this.formGroup.controls['rardOwner'].value) {
        this.queryURL += '"rardOwner":"' + this.formGroup.controls['rardOwner'].value + '"'
      }

      if (this.formGroup.controls['rardDetailedVehicleType'].value) {
        this.queryURL += '"rardDetailedVehicleType":"' + this.formGroup.controls['rardDetailedVehicleType'].value + '"'
      }
      if (this.formGroup.controls['rardSerialNo'].value) {
        this.queryURL += '"rardSerialNo":"' + this.formGroup.controls['rardSerialNo'].value + '"'
      }
      if (this.formGroup.controls['rardDateUse'].value) {
        this.queryURL += '"rardDateUse":"' + this.formGroup.controls['rardDateUse'].value + '"'
      }
      if (this.formGroup.controls['rardVehicleManufacturerCode'].value) {
        this.queryURL += '"rardVehicleManufacturerCode":"' + this.formGroup.controls['rardVehicleManufacturerCode'].value + '"'
      } */

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


      /* let responsePromise = this.http.get('http://172.16.22.64:3000/api/v1/RollingAssetRfidData' + this.queryURL).toPromise() */

      let responsePromise = this.http.get('http://http://172.16.22.64:3000/api/v1/RollingAssetRfidData/rfidData?' + this.queryURL2).toPromise()

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
          Object.keys(this.formGroup.controls).forEach(key => {
            // this.formGroup.controls[key].setValue(null)
          });

          // this.formGroup.reset()
          // this.filteredItemsAPI = this.itemsAPI
        }
      }, error => {
        console.log("Error: ")
        console.log(error)
      }).finally(() => {
        this.showSearchingOverlay = false

      }
      )



      /*       this.http.get('http://172.16.22.64:3000/api/v1/RollingAssetRfidData' + this.queryURL).subscribe(data => {
              this.data = data
              console.log(this.data)
              this.searchedItems = this.data
              this.showResults = true
              Object.keys(this.formGroup.controls).forEach(key => {
                // this.formGroup.controls[key].setValue(null)
              });
              this.formGroup.markAsPristine
              this.formGroup.markAsUntouched
              // this.formGroup.reset()
              // this.filteredItemsAPI = this.itemsAPI
            }, err => {
              console.log('HTTP ERROR' + err)
              //Present toast here 
            }).add(() => { this.showSearchingOverlay = false }) */

      this.queryURL = '?filter={"where":{'
      this.queryURL2 = ''
    }

    this.formGroup = this.fb.group(
      {
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
      }, { validator: this.meraValidator }
    )

    console.log('Init 2')
    console.log(this.formGroup.controls['rardDateUse'].value)
    console.log(this.formGroup.controls['rardDateUseRangeStart'].value)
    console.log(this.formGroup.controls['rardDateUseRangeEnd'].value)

  }

  constructor(public http: HttpClient, public fb: FormBuilder, public toastController: ToastController, public alertController: AlertController) {







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
      return item.rardOwner.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1 || item.rardSerialNo.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1;
    });
    this.filteredItemsAPI = filteredItemsAPI
  }

  /*   updateFilter() {
      console.log(this.filterString)
      // this.filterString = this.filterString.toLowerCase();
  
      // filter our data
      this.filteredItemsAPI = this.itemsAPI.filter((item) => { 
        return item.rardOwner.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1; });
  
      // update the rows
      this.rows = this.filteredItemsAPI;
      // Whenever the filter changes, always go back to the first page
      // this.table.offset = 0;
    } */

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
        !(key === 'rardYearOfManufactureRange' && (formGroup.controls[key].value.upper === 0 || formGroup.controls[key].value.upper === undefined)
        )
        
        // &&
        // !((key.match('rardDateUse')) && formGroup.controls[key].value === '')

        //if End Date Use is not empty the the Start Date Use should not be empty
         &&
         !(key==='rardDateUseRangeEnd' && formGroup.controls[key].value !== '' && formGroup.controls['rardDateUseRangeStart'].value==='')   
      ) {
        console.log("returning null. valid form")
        return null
      }
    }

    console.log('returning false. form is not valid')
    return { valid: false }
  }

  ngOnInit() {

    console.log('Init')

    this.formGroup = this.fb.group(
      {
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
      }, { validator: this.meraValidator }
    )
    console.log('Init')
    console.log(this.formGroup.controls['rardDateUse'].value)
    console.log(this.formGroup.controls['rardDateUseRangeStart'].value)
    console.log(this.formGroup.controls['rardDateUseRangeEnd'].value)
    // this.formGroup.

    /*    this.http.get('http://172.16.22.64:3000/api/RollingAssetRfidData/rfidData').subscribe(data => {
         this.data = data
         console.log(this.data.Result)
         this.itemsAPI = this.data.Result
         this.filteredItemsAPI = this.itemsAPI
       }, err => {
         console.log('HTTP ERROR' + err)
       }) */

    /*     new Promise(resolve => {
                  this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(data => {
                    resolve(data);
                  }, err => {
                    console.log(err);
                  });
                }).then(data=>{
                  this.users=data
                  console.log(this.users)
                }) */
  }
} 
