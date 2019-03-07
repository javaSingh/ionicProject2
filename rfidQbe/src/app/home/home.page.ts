import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  formGroup: FormGroup
  results: any[] = []
  index

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public toastController: ToastController
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
  }

  customValidator(formGroup: FormGroup) {

    var atLeastOneIsFilled: boolean = false

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

  clearSelection(key){
    console.log('Inside clearSelection('+key+')')
    if(this.formGroup.controls[key].value){
      console.log('Select value Found for',key)
    }
  }

  customAlertOptions: any = {
    header: 'Owner',
    translucent: true,
  };


}
