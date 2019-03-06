import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  formGroup: FormGroup

  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
  ) {
    console.log('Constructor')
  }

  ngOnInit() {
    console.log('ngOnInit')
    this.formGroup = this.fb.group({

      'assetType': [''],
      'yearOfManufacture': [''],
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
    var jsonData=this.formGroup.value
    console.log(JSON.stringify(this.formGroup.value))
    Object.keys(jsonData).forEach(k => (!jsonData[k] && jsonData[k] !== undefined) && delete jsonData[k]);
    console.log(JSON.stringify(this.formGroup.value))
    this.http.get('http://172.16.22.64:3000/Tags/v1/EPC/qbe?filter=' + JSON.stringify(this.formGroup.value), { reportProgress: true }).subscribe(data => {
      console.log('HTTP GET Result: ', data)
    }, error => {
      console.log('HTTP GET ERROR: ', error)
    })

  }


}
