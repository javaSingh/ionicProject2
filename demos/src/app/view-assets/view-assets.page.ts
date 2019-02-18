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


  onSubmit() {
    if (this.showResults) {
      this.showResults = false
      this.searchedItems = []

    } else {
      this.showSearchingOverlay = true
      console.log(this.formGroup.value, this.formGroup.valid);
      console.log(this.formGroup.controls['rardYearOfManufacture'].value)
      // console.log(this.formGroup.get('rardAssetType').value)
      Object.keys(this.formGroup.controls).forEach(key => {
        if (this.formGroup.controls[key].value) {
//if range is not empty and field is empty
       if(this.formGroup.controls[key].value.lower!=undefined && this.formGroup.controls['rardYearOfManufacture'].value<1){
        // "rardYearOfManufacture":"{between:[30,66]}"
        this.queryURL += '"rardYearOfManufacture":"{between:['+this.formGroup.controls[key].value.lower+','+this.formGroup.controls[key].value.upper+']}"'
          }
          else if(key!=='rardYearOfManufactureRange'){
            this.queryURL += '"' + key + '":"' + this.formGroup.controls[key].value + '"'
          }
        }
      });

      this.formGroup = this.fb.group(
        {
          'rardOwner': [''],
          'rardDetailedVehicleType': [''],
          'rardSerialNo': [''],
          'rardAssetType': [''],
          'rardYearOfManufacture': [''],
          'rardYearOfManufactureRange': [''],
          'rardDateUse': [''],
          'rardVehicleManufacturerCode': [''],
        }, { validator: this.meraValidator }
      )

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

      let timeoutPromise = new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
          clearTimeout(wait);
          resolve('Connection Timed Out');
        }, 3000)
      })


      let responsePromise = this.http.get('http://172.16.22.64:3000/api/v1/RollingAssetRfidData' + this.queryURL).toPromise()

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
      },error=>{
        console.log("Error: "+error)
      }).finally(()=>{
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
    }
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
            this.showDownloadAlert=false
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

    /*     Object.keys(formGroup.controls).forEach(key => {
          // console.log('length of control: '+key+' is ' +formGroup.controls[key].value.length+'.')
          if (formGroup.controls[key].value.length < 1) {
            console.log('returning false')
            return { valid: false }
          }
        }); */

        
    for (const key in formGroup.controls) {
      if (
        !(formGroup.controls[key].value.length < 1)
        && 
        !(key==='rardYearOfManufactureRange' && formGroup.controls[key].value.upper===0
        )
      ) 
      {
        console.log('returning null. valid form')
        return null
      }
    }
    // this.formGroup.controls['owner'].value.length<1
    /*     if (formGroup.controls['rardOwner'].value.length < 1 &&
          formGroup.controls['rardDetailedVehicleType'].value.length < 1 &&
          formGroup.controls['rardSerialNo'].value.length < 1 &&
          formGroup.controls['rardAssetType'].value.length < 1 &&
          formGroup.controls['rardYearOfManufacture'].value.length < 1 &&
          formGroup.controls['rardDateUse'].value.length < 1 &&
          formGroup.controls['rardVehicleManufacturerCode'].value.length < 1) {
          return { valid: false }
        } */
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
        'rardVehicleManufacturerCode': [''],
      }, { validator: this.meraValidator }
    )
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
