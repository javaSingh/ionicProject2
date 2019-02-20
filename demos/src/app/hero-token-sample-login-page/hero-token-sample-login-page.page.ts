import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-hero-token-sample-login-page',
  templateUrl: './hero-token-sample-login-page.page.html',
  styleUrls: ['./hero-token-sample-login-page.page.scss'],
})

// Route
// { path: 'hero-token-sample-login-page',

export class HeroTokenSampleLoginPagePage implements OnInit {

  userPin: string = ''
  accessToken
  refreshToken
  showLogin: boolean = false
  showNoSuchUser: boolean = false
  showPinForm: boolean = false
  loggingInProcess: boolean = false
  userLoginId: string = ""
  password: string = ""

  HOST: string = 'http://172.16.22.155'
  PORT: string = '3000'

  /*   HOST: string = 'http://10.64.29.89'
    PORT: string = '3002' */

  submitPin() {
    console.log('Submitting Pin')
    console.log(this.userPin)
    // for (var i in [1, 2, 3]) {
    if (this.userPin !== '') {
      console.log('condition true inside if')
      this.validatePin(1).subscribe((data) => {
        console.log('inside subscription')
        console.log(data)
        console.log(data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
        this.validateAccessToken()
      }, error => {
        console.log('Error:')
        console.log(error)
        console.log(error.error.error.message)
        if (error.error.error.message === 'jwt malformed')
          console.log('Refresh Token is corrupted')
      })
    }
    // }
  }

  validateAccessToken() {
    console.log('@Validate Access Token: ' + localStorage.getItem('accessToken'))
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', localStorage.getItem('accessToken'))
    // headers = headers.set('x-auth-token','accessTokenCorrupted')
    let options = { headers: headers };

    let timeoutPromise = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Timeout');
      }, 3000)
    })

    let tokenValidationPromise = this.httpClient.post(this.HOST + ':' + this.PORT + '/api/blogins/beforeLogin', null, options).toPromise()

    let race = Promise.race([timeoutPromise, tokenValidationPromise])
    race.then((res) => {
      console.log(res)
      if (res === 'Timeout') {
        this.presentToast("Unable to connect now.")
      }
    }, error => {
      console.log('Error: ' + error)
    }).finally(() => {
      console.log('Finally')
    })


    // http://172.16.22.155:3000/api/blogins/beforeLogin
    console.log('Token Validation in progress')
    this.httpClient.post(this.HOST + ':' + this.PORT + '/api/blogins/beforeLogin', null, options).subscribe((data) => {
      console.log("Access Token Validation Response:")
      console.log(data)
      if (data === 'sucess')//sic at server
      {
        console.log('Token Authenticated Successful')
        // setTimeout(()=>{console.log()})
        this.navCtrl.navigateForward('/home');
      }
      else {
        console.log(data)
      }
    }, error => {
      console.log(error)
      if (error.error.code === 'jwt malformed') {
        this.showLogin = true
        console.log('Clear tokens and keep on login page')
        localStorage.setItem('accessToken', '')
        localStorage.setItem('refreshToken', '')
      }
      else if (error.error.code === 'jwt expired') {
        console.log('Condition Detected: Expiry')
        this.refreshToken = localStorage.getItem('refreshToken')
        if (this.refreshToken === '' || this.refreshToken === null) {
          console.log('Condition Detected: refreshToken=""')
          this.showLogin = true
        }
        else {
          this.showPinForm = true
        }
      }
    })
  }
  validatePin(retryCount) {
    console.log('Inside Validate Pin')
    let headers = new HttpHeaders();
    headers = headers.set('x-ref-token', '12121')
    let options = { headers: headers };
    console.log('before return. URL To Post: ' + this.HOST + ':' + this.PORT + '/api/newaccessToken')
    return this.httpClient.post(this.HOST + ':' + this.PORT + '/api/newaccessToken',
      null, options)
  }

  /* {message: "Login successfully", user: "EAM47E", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBT…PTiJ9.obl44D8Rf8xBWF_ns81wLpQq4r5D2Uwi5TuRpecPd28", refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBT…PTiJ9.6zBBRHJhA-Sdi-oY4XrAJhCRpNM3hV-dEj4mOBIbwcM"}
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBTTQ3RSAiLCJzdGF0dXMiOiJWRVJJRklFRCIsInRva2VuVHlwZSI6IkFUS04iLCJpYXQiOjE1NTA1NTg2ODksImV4cCI6MTU1MDY0NTA4OSwiYXVkIjoid3d3LmhtaXMuY28uaW4iLCJpc3MiOiJSQUlMV0FZLUJPQVJEIiwic3ViIjoiQVVUSE9SSVpBVElPTiJ9.obl44D8Rf8xBWF_ns81wLpQq4r5D2Uwi5TuRpecPd28"
message: "Login successfully"
refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBTTQ3RSAiLCJzdGF0dXMiOiJWRVJJRklFRCIsInRva2VuVHlwZSI6IlJUS04iLCJpYXQiOjE1NTA1NTg2ODksImV4cCI6MTU1MzE1MDY4OSwiYXVkIjoid3d3LmhtaXMuY28uaW4iLCJpc3MiOiJSQUlMV0FZLUJPQVJEIiwic3ViIjoiQVVUSE9SSVpBVElPTiJ9.6zBBRHJhA-Sdi-oY4XrAJhCRpNM3hV-dEj4mOBIbwcM"
user: "EAM47E" */


  login() {
    this.loggingInProcess = true
    if (this.userLoginId !== '' && this.password !== '') {
      console.log('User Creds: ' + this.userLoginId + " " + this.password)
      // {"userLoginId":"111111115167","password":"Y755RR8"}
      this.httpClient.post(this.HOST + ':' + this.PORT + "/api/user/login", JSON.parse('{"userLoginId":"' + this.userLoginId + '","password":"' + this.password + '"}')).subscribe((data) => {
        console.log("Post Response Data: ")
        console.log(data.message)

        if (data.message === 'Login successfully') {
          console.log("Login is Successful")
          setTimeout(() => { console.log("Access Token Has Expired") }, 5000 * 12 * 5)
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          this.navCtrl.navigateBack('/home');
        }
        else if (data.message === 'user not found') {
          this.showNoSuchUser = true
          this.userLoginId = ""
          this.password = ""
          this.loggingInProcess = false
        }

        else {
          console.log(data.message)
        }
      }, error => {
        console.log('Error: ')
        console.log(error)
        this.loggingInProcess = false
      })

    }
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

  constructor(public toastController: ToastController, public httpClient: HttpClient, public navCtrl: NavController) {
    console.log('Constructor Running')

    this.accessToken = localStorage.getItem('accessToken')
    console.log('Getting Locally Stored access Token: ' + this.accessToken)
    this.refreshToken = localStorage.getItem('refreshToken')
    console.log('Getting Locally Stored refresh Token: ' + this.refreshToken)

    if (this.accessToken === '' || this.accessToken === null) {
      console.log('Condition Detected: accessToken===""')
      this.showLogin = true
      // Stay on this page
    }
    else {
      this.validateAccessToken()
    }
  }

  ngOnInit() {
    console.log('This is init')
  }

}