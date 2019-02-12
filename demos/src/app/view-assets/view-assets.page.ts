import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
import { HttpClient } from '@angular/common/http';

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
  itemsAPI
  data

  constructor(public http: HttpClient) { }

  makeExcel() {
    let sheet = XLSX.utils.json_to_sheet(this.itemsAPI);
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
    this.http.get('http://172.16.22.64:3000/api/RollingAssetRfidData/rfidData').subscribe(data=>{
      this.data=data
      console.log(this.data.undefined)
      this.itemsAPI=this.data.undefined

    })
  }
} 
