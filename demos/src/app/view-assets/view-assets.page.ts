import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
import { HttpClient } from '@angular/common/http';
import {  FormArray,FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';



@Component({
  selector: 'app-view-assets',
  templateUrl: './view-assets.page.html',
  styleUrls: ['./view-assets.page.scss'],
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
  searchedItems=[]
  filteredItemsAPI
  data
  filterString
  uniqueOwner=['PUN','DEL','NNL','DMV','SDAH']
  uniqueVehicleType=['Coach','Locomotive','Carriage','Gurad Van']
  uniqueAssetType=['Fan','Tyre','Lock','Overhead']
uniqueVendorCode=['TCS','TM','Wipro','CRIS','Dell']
uniqueYearOfManufacure=['2001','2002','2018','2019','2020']
  formGroup:FormGroup
  queryURL:string='?filter={"where":{'
  showResults:boolean=false

  
  onSubmit() {
    if(this.showResults){
      this.showResults=false
      this.searchedItems=[]

    }else{
    console.log(this.formGroup.value, this.formGroup.valid);
    console.log(this.formGroup.get('assetType').value)
   if(this.formGroup.controls['assetType'].value){
      this.queryURL+='"rardAssetType":"'+this.formGroup.controls['assetType'].value+'"'
    }
 
    if(this.formGroup.controls['yearOfManufacture'].value){
      this.queryURL+='"rardYearOfManufacture":"'+this.formGroup.controls['yearOfManufacture'].value+'"'
    }
        
    if(this.formGroup.controls['owner'].value){
      this.queryURL+='"rardOwner":"'+this.formGroup.controls['owner'].value+'"'
    }
    
    if(this.formGroup.controls['detailedVehicleType'].value){
      this.queryURL+='"rardDetailedVehicleType":"'+this.formGroup.controls['detailedVehicleType'].value+'"'
    }
    if(this.formGroup.controls['serialNo'].value){
      this.queryURL+='"rardSerialNo":"'+this.formGroup.controls['serialNo'].value+'"'
    }
    if(this.formGroup.controls['datePutIntoUse'].value){
      this.queryURL+='"rardDateUse":"'+this.formGroup.controls['datePutIntoUse'].value+'"'
    }
    if(this.formGroup.controls['vendorCode'].value){
      this.queryURL+='"rardVehicleManufacturerCode":"'+this.formGroup.controls['vendorCode'].value+'"'
    } 
    this.queryURL+='}}'
    this.queryURL=this.queryURL.split('""').join('","')
    console.log(this.queryURL)

    this.http.get('http://172.16.22.64:3000/api/RollingAssetRfidData'+this.queryURL).subscribe(data => {
      this.data = data
      console.log(this.data)
      this.searchedItems = this.data
      this.showResults=true
      // this.filteredItemsAPI = this.itemsAPI
    }, err => {
      console.log('HTTP ERROR' + err)
    })

    this.queryURL='?filter={"where":{'
  }
  }

  validateUrl(control: FormControl) {
    return false
  }

  constructor(public http: HttpClient,public fb:FormBuilder) { 


  }

  startFilter() {
    console.log(this.filterString)
    const filteredItemsAPI = this.itemsAPI.filter((item) => {
      return item.rardOwner.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1 || item.rardSerialNo.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1 ;
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
  }

  ngOnInit() {

    console.log('Init')

    this.formGroup=this.fb.group(
      {
        assetType:[''],
        yearOfManufacture:[''],
        owner:[''],
        detailedVehicleType:[''],
        serialNo:[''],
        datePutIntoUse:[''],
        vendorCode:['']
      }
    )

 /*    this.http.get('http://172.16.22.64:3000/api/RollingAssetRfidData/rfidData').subscribe(data => {
      this.data = data
      console.log(this.data.Result)
      this.itemsAPI = this.data.Result
      this.filteredItemsAPI = this.itemsAPI
    }, err => {
      console.log('HTTP ERROR' + err)
    }) */

    /* new Promise(resolve => {
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
