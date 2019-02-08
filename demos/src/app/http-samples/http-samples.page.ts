import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-http-samples',
  templateUrl: './http-samples.page.html',
  styleUrls: ['./http-samples.page.scss'],
})
export class HttpSamplesPage implements OnInit {
  userName:string
  password:string

  constructor() { }

  submit(){
    console.log("Submit Clicked")
    console.log(this.userName)
    console.log(this.password)

    // call the rest api
  }

  ngOnInit() {
  }

}
