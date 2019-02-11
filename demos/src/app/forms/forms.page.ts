import { Component, OnInit } from '@angular/core';
import {  FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  formGroup:FormGroup

  
  nameKeydown(){
    console.log('Name Keydown')
    this.formGroup.controls.name
  }

  onSubmit() {
    console.log(this.formGroup.value, this.formGroup.valid);
    // FormGroup.
    this.formGroup.reset()
  }

  patchValue(){
    console.log('Patching')
    this.formGroup.patchValue({
      name:'PatchedName',
      email:'Patching Work',
      confirm:'pw'
    })
    this.formGroup.setValue({
      name:'PatchedName',
      email:'Patching Work',
      confirm:'pw'
    })
  }

  constructor(public fb:FormBuilder) {
    this.formGroup=this.fb.group(
      {

        name:['',Validators.required
        // ,Validators.minLength(2)
      ],
        email:['',Validators.required],
        confirm:['',Validators.required]
        // cities: this.fb.array([])
      }
    )
    //Not Using FormBuider.
/*     this.formGroup=new FormGroup(
      {
        name:new FormControl('',Validators.required),
        email:new FormControl('',Validators.required),
        confirm:new FormControl('',Validators.required)
      }
    ) */
  }

  ngOnInit() {
  }

}
