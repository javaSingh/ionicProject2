import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'

@Component({
  selector: 'app-qbedemo',
  templateUrl: './qbedemo.page.html',
  styleUrls: ['./qbedemo.page.scss'],
})
export class QBEDemoPage implements OnInit {

  user = {}
  name: string = ''
  email: string = ''
  msg: string = ''
  searchRequired: boolean = false
  trashAfterSelect:boolean=false
  searchLable: string = "Search"
  list = []
  i:number



  constructor() {

    this.list = JSON.parse(localStorage.getItem('list'))
    if (this.list == undefined || this.list === null) {
      console.log('No list detected in local Storage')
      this.list = [{ name: 'baseName', email: 'baseEmail', msg: 'baseMsg' }]
      localStorage.setItem('list', JSON.stringify(this.list))
      console.log('List is added to local Storage now. Stored List: ' + JSON.parse(localStorage.getItem('list')))
    }
    else {
      console.log('List: ' + JSON.parse(localStorage.getItem('list')) + ' is already present in local storage')
    }
  }


  ngOnInit() {
  }

  save() {
    // this.user = this.list.find(a => a.name === this.name && a.email===this.email)
    this.user=this.list.find(a => a.name === this.name && a.email===this.email)
    if(this.user)
    {
      alert('no changes to save ')
      console.log('user (name and emailid) already exits. will be updated only')
    }
    else{
    console.log('Data Received Inside save(): ' + this.name + this.email + this.msg)
    //push to list
    this.list.push({ name: this.name, email: this.email, msg: this.msg })
    alert('Data Saved')
    //clear the form
    this.name = ''
    this.email = ''
    this.msg = ''

    //save to local storage
    localStorage.setItem('list', JSON.stringify(this.list))
    console.log('Added to list. New list is: ' + this.list)
    if(this.searchRequired)
    {
      this.searchRequired=false
      console.log('hidden')
      this.searchRequired=true
      console.log('displayed')
    }
    }
  }

  selected(name,email) {
    this.trashAfterSelect=true
    this.searchRequired=false

    console.log('Selection made:' + name)
    // console.log(this.list.find(a => a.name === name && a.email===email))
    this.user = this.list.find(a => a.name === name && a.email===email)
    // console.log(this.user.email)
    this.name=this.user.name
    this.email=this.user.email
    this.msg=this.user.msg
    
  }

  searchButtonClicked() {
    if (!this.searchRequired) {
      this.searchRequired = true

    }
    else {
      this.searchRequired = false
    }
  }

  trashClicked(name,email){
    this.trashAfterSelect=false
    this.searchRequired=false
    console.log('Trash Clicked')
    console.log(name+', '+email+' is ready to be deleted from list')
    this.i=this.list.findIndex(a => a.name === name && a.email===email)
    this.trashAfterSelect=false
    delete this.list[this.i]
    alert('Deleted')
    this.list.splice(this.i,1)
    console.log('filtered. list after filter ' +this.list)
    localStorage.setItem('list',JSON.stringify(this.list))
    console.log('local storage updated')
    this.name=''
    this.email=''
    this.msg='' 
  }

}
