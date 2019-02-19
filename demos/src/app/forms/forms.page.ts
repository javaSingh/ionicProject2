import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';

import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  formGroup: FormGroup
  i: number = 0


  addEmail() {
    console.log('Adding Email Field')
    const control = <FormArray>this.formGroup.controls.emailArray
    control.push(this.fb.group({ email: '' }))
    console.log('Pushed')
  }
  removeEmail(removeIndex: number) {
    console.log('Removing')
    const control = <FormArray>this.formGroup.controls.emailArray
    control.removeAt(removeIndex)
    console.log('Removed')

  }

  nameKeydown() {
    console.log('Name Keydown')
    this.formGroup.controls.name
  }

  makeExcel() {
    let sheet = XLSX.utils.json_to_sheet([{ key: "value" }]);
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

  onSubmit() {
    console.log(this.formGroup.value, this.formGroup.valid);
    // FormGroup.
    this.formGroup.reset()
    // this.makeExcel()
  }



  patchValue() {
    console.log('Patching')
    this.formGroup.patchValue({
      name: 'PatchedName',
      email: 'Patching Work'
    })
    this.formGroup.setValue({
      name: 'PatchedName',
      email: 'Patching Work'
    })
  }
  x: FormGroup

  meraEmailArrayValidator(formGroup: FormGroup) {
    // console.log(formGroup.controls['emailArray'].controls)
    // console.log(formGroup.controls['emailArray'].controls[0])
    for (const key in formGroup.controls['emailArray'].controls) {
      // console.log(formGroup.controls['emailArray'].controls[key].controls['email'].value)
      if (!(formGroup.controls['emailArray'].controls[key].controls['email'].value.length < 1)) {
        console.log('Atleast one Email Field is not Empty. Email is Valid')
        return null
      }
    }
    //this will giva an array of FormGroup

    console.log('returning false. email is not valid')
    return { valid: false }
  }

  constructor(public fb: FormBuilder) {
    this.formGroup = this.fb.group(
      {
        emailArray: this.fb.array([this.fb.group({ email: [''] })]),
        name: ['', Validators.required
          // ,Validators.minLength(2)
        ]
      }, { validator: this.meraEmailArrayValidator }
    )
    //Not Using FormBuider.
    /*     this.formGroup=new FormGroup(
          {
            name:new FormControl('',Validators.required),
            email:new FormControl('',Validators.required)
          }
        ) */
  }

  ngOnInit() {
  }

}
