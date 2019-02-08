import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular'

import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qbedemo',
  templateUrl: './qbedemo.page.html',
  styleUrls: ['./qbedemo.page.scss'],
})
export class QBEDemoPage implements OnInit {

  user = { name: '', email: '', msg: '' }
  userIndex: number = -1
  name: string = ''
  nameFilter: string
  email: string = ''
  msg: string = ''
  searchRequired: boolean = false
  trashAfterSelect: boolean = false
  forUpdate: boolean = false
  filterRequired = false
  searchLable: string = "Search"
  list = []
  filteredList
  i: number



  constructor(public toastController: ToastController, public modalController: ModalController, public alertController: AlertController) {

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

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm !',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      translucent: true,
      showCloseButton: true,
      closeButtonText: 'X',
      duration: 1000
    });
    toast.present();
  }


  ngOnInit() {
    // this.presentToast('Welcome !')
    // this.presentModal()
  }


  saveListToLocalStorage(message: string) {
    localStorage.setItem('list', JSON.stringify(this.list))
    this.presentToast(message)
    //clear the form
    this.name = ''
    this.email = ''
    this.msg = ''
    this.trashAfterSelect = false

  }

  save() {
    this.searchRequired = false
    if (this.forUpdate) {
      this.userIndex = this.list.findIndex(a => a.name === this.name)
      this.user = this.list[this.userIndex]
      if (this.user.email === this.email && this.user.msg === this.msg) {
        this.presentToast('No changes to save.')
      }
      else {
        this.list[this.userIndex].msg = this.msg
        this.list[this.userIndex].email = this.email
        this.saveListToLocalStorage('Data Updated')
        this.forUpdate = false
      }
    }
    // this.user = this.list.find(a => a.name === this.name && a.email===this.email)
    else {

      console.log('Data Received Inside save(): ' + this.name + this.email + this.msg)
      //push to list
      this.list.push({ name: this.name, email: this.email, msg: this.msg })
      this.saveListToLocalStorage('Data Saved')

      // console.log('Added to list. New list is: ' + this.list)
    }
  }

  selected(name, email) {
    this.filteredList = []
    this.nameFilter = ''
    this.searchRequired = false
    this.trashAfterSelect = true
    this.forUpdate = true
    this.filterRequired = false
    // console.log('Selection made:' + name)
    // console.log(this.list.find(a => a.name === name && a.email===email))
    this.user = this.list.find(a => a.name === name && a.email === email)
    // console.log(this.user.email)
    this.name = this.user.name
    this.email = this.user.email
    this.msg = this.user.msg

  }

  clearSearch() {
    console.log('Clear Selected')
    this.forUpdate = false
    this.trashAfterSelect = false
    this.searchRequired = false
    this.name = ''
    this.msg = ''
    this.email = ''
  }

  searchButtonClicked() {
    if (this.name !== '' || this.email !== '') {
      if (this.list.find(a => a.name === this.name || a.email === this.email)) {
        this.searchRequired = false
        this.userIndex = this.list.findIndex(a => a.name === this.name || a.email === this.email)
        this.name = this.list[this.userIndex].name
        this.email = this.list[this.userIndex].email
        this.msg = this.list[this.userIndex].msg
        this.trashAfterSelect = true
        this.forUpdate = true
      }
      else {
        this.presentToast('No Such User. Select From Below')
        this.searchRequired = true
      }
    }
    else if (this.searchRequired) {
      this.searchRequired = false
    }
    else {
      this.searchRequired = true
    }
  }

  trashClicked(name, email) {
    // this.presentAlertConfirm()
    this.trashAfterSelect = false
    this.searchRequired = false
    this.forUpdate = false
    console.log('Trash Clicked')
    console.log(name + ', ' + email + ' is ready to be deleted from list')
    this.i = this.list.findIndex(a => a.name === name && a.email === email)
    this.trashAfterSelect = false
    delete this.list[this.i]
    this.presentToast('Deleted')
    this.list.splice(this.i, 1)
    console.log('filtered. list after filter ' + this.list)
    localStorage.setItem('list', JSON.stringify(this.list))
    console.log('local storage updated')
    this.name = ''
    this.email = ''
    this.msg = ''
  }


  // [(ngModel)]='name'

  startFilteringUpdated(filterItem) {
    // console.log('Filter Item '+ filterItem)
    // console.log('here i am')
    this.filterRequired = true
    if (this.name === '' && this.email === '') { this.filterRequired = false }
    if(this.name!=='' && filterItem==='email')
    {
      this.filteredList = this.filteredList.filter((item) => { return item.email.toLowerCase().indexOf(this.email.toLowerCase()) > -1; });
    }
    if(this.email!=='' && filterItem==='name')
    {
      this.filteredList = this.filteredList.filter((item) => { return item.name.toLowerCase().indexOf(this.name.toLowerCase()) > -1; });
    }
    if (filterItem === 'name') {
      this.filteredList = this.list.filter((item) => { return item.name.toLowerCase().indexOf(this.name.toLowerCase()) > -1; });
    }
    if (filterItem === 'email') {
      this.filteredList = this.list.filter((item) => { return item.email.toLowerCase().indexOf(this.email.toLowerCase()) > -1; });
    }



  }

}


