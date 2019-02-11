import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';



// import { HTTP } from '@ionic-native/http/ngx';

//npm install @ionic-native/http --save


@Component({
  selector: 'app-http-samples',
  templateUrl: './http-samples.page.html',
  styleUrls: ['./http-samples.page.scss'],
})
export class HttpSamplesPage implements OnInit {
  userName: string = 'cris'
  password: string = 'crisp'
  data
  res:any
  users: any
  constructor(public http: HttpClient, public modalController: ModalController, ) {

    //below is via promise
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

    //below is via Observable
    this.http.get('http://jsonplaceholder.typicode.com/users/').subscribe(data => {
      this.users = data
      // console.log(this.data)
      // console.log(this.users[1].userId) 
    })
  }

  addNewCity(){
    console.log("Adding City")
  }


  async presentModal(user) {
    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: { value: user.name + ' ' + user.email + ' ' + user.address.street }
    });
    return await modal.present();
  }

  selected(user) {
    console.log("Selected:" + user.name)
    //Open a Modal here
    this.presentModal(user)
  }
  submit() {
    console.log("Submit Clicked")
    console.log(this.userName)
    console.log(this.password)
    console.log(this.http)
    this.http.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify({ title: this.userName, body: this.password, userId: 1 }), {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(data => {
      this.res = data
        console.log('Response Data: ' + this.res.title)
    }, error => {
      console.log(error)
    })
  }
  ngOnInit() {
  }
}
