import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hero-token-sample-login-page',
  templateUrl: './hero-token-sample-login-page.page.html',
  styleUrls: ['./hero-token-sample-login-page.page.scss'],
})

// Route
// { path: 'hero-token-sample-login-page', loadChildren: './hero-token-sample-login-page/hero-token-sample-login-page.module#HeroTokenSampleLoginPagePageModule' },

export class HeroTokenSampleLoginPagePage implements OnInit {

  userPin: string = ''
  accessToken
  refreshToken
  showLogin: boolean = false
  showNoSuchUser: boolean = false
  showPinForm: boolean = false
  userLoginId: string = ""
  password: string = ""

  submitPin() {
    console.log('Submitting Pin')
    console.log(this.userPin)
  }

  validateAccessToken() {
    console.log('@Validate Access Token: ' + localStorage.getItem('accessToken'))
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token', localStorage.getItem('accessToken'))
    // headers = headers.set('x-auth-token','accessTokenCorrupted')
    let options = { headers: headers };



    // http://172.16.22.155:3000/api/blogins/beforeLogin
    console.log('Token Validation in progress')
    this.httpClient.post('http://172.16.22.155:3000/api/blogins/beforeLogin', null, options).subscribe((data) => {
      console.log("Access Token Validation Response:")
      console.log(data)
      if (data === 'sucess')//sic at server
      {
        console.log('Token Authenticated Successful')
        //send to home page
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
          var pinValidationResponse
          // for (var i in [1, 2, 3]) {
          pinValidationResponse = this.validatePin(1)
          pinValidationResponse.subscribe((data) => {
            console.log(data.accessToken)
            localStorage.setItem('accessToken', data.accessToken)
            this.validateAccessToken()
          }, error => {
            console.log(error)
          })

          // }
          //stay here
        }

      }
    }
    )
    // return ' Access Token Validation Status'

  }
  validatePin(retryCount) {
    let headers = new HttpHeaders();
    headers = headers.set('x-ref-token', localStorage.getItem('refreshToken'))
    let options = { headers: headers };
    return this.httpClient.post('http://172.16.22.155:3000/api/newaccessToken', null, options)
  }

  /* {message: "Login successfully", user: "EAM47E", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBT…PTiJ9.obl44D8Rf8xBWF_ns81wLpQq4r5D2Uwi5TuRpecPd28", refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBT…PTiJ9.6zBBRHJhA-Sdi-oY4XrAJhCRpNM3hV-dEj4mOBIbwcM"}
accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBTTQ3RSAiLCJzdGF0dXMiOiJWRVJJRklFRCIsInRva2VuVHlwZSI6IkFUS04iLCJpYXQiOjE1NTA1NTg2ODksImV4cCI6MTU1MDY0NTA4OSwiYXVkIjoid3d3LmhtaXMuY28uaW4iLCJpc3MiOiJSQUlMV0FZLUJPQVJEIiwic3ViIjoiQVVUSE9SSVpBVElPTiJ9.obl44D8Rf8xBWF_ns81wLpQq4r5D2Uwi5TuRpecPd28"
message: "Login successfully"
refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVBTTQ3RSAiLCJzdGF0dXMiOiJWRVJJRklFRCIsInRva2VuVHlwZSI6IlJUS04iLCJpYXQiOjE1NTA1NTg2ODksImV4cCI6MTU1MzE1MDY4OSwiYXVkIjoid3d3LmhtaXMuY28uaW4iLCJpc3MiOiJSQUlMV0FZLUJPQVJEIiwic3ViIjoiQVVUSE9SSVpBVElPTiJ9.6zBBRHJhA-Sdi-oY4XrAJhCRpNM3hV-dEj4mOBIbwcM"
user: "EAM47E" */


  // Access to XMLHttpRequest at 'http://172.16.22.155:3000/api/blogins/beforeLogin' from origin 'http://localhost:8100' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

  login() {
    if (this.userLoginId !== '' && this.password !== '') {
      console.log('User Creds: ' + this.userLoginId + " " + this.password)
      // {"userLoginId":"111111115167","password":"Y755RR8"}
      this.httpClient.post("http://172.16.22.155:3000/api/user/login", JSON.parse('{"userLoginId":"' + this.userLoginId + '","password":"' + this.password + '"}')).subscribe((data) => {
        console.log("Post Response Data: ")
        console.log(data.message)
        if (data.message === 'Login successfully') {
          console.log("Login is Successful")
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          this.navCtrl.navigateBack('/home');
        }
        else if (data.message === 'user not found') {
          this.showNoSuchUser = true
          this.userLoginId = ""
          this.password = ""
        }

        else {
          console.log(data.message)
        }
      }, error => {
        console.log(error)
      })

    }
  }

  constructor(public httpClient: HttpClient, public navCtrl: NavController) {
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

// POST http://172.16.22.155:3000/api/user/login 502 (cannotconnect)
// Access to XMLHttpRequest at 'http://172.16.22.155:3000/api/user/login' from origin 'http://localhost:8100' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
/* HttpErrorResponse {headers: HttpHeaders, status: 0, statusText: "Unknown Error", url: "http://172.16.22.155:3000/api/user/login", ok: false, …}
error: ProgressEvent {isTrusted: true, lengthComputable: false, loaded: 0, total: 0, type: "error", …}
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, headers: Map(0)}
message: "Http failure response for http://172.16.22.155:3000/api/user/login: 0 Unknown Error"
name: "HttpErrorResponse"
ok: false
status: 0
statusText: "Unknown Error"
url: "http://172.16.22.155:3000/api/user/login"
__proto__: HttpResponseBase */
