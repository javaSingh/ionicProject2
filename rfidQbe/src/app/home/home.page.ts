import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { CalendarModal, CalendarModalOptions, CalendarResult, } from 'ion2-calendar';
import { HttpProvider } from '../providers/http/http'
// npm i ionic4-date-picker --save
import * as XLSX from 'xlsx';
// npm i --save xlsx
import { saveAs } from 'file-saver';
// npm i file-saver
import { IonicSelectableComponent } from 'ionic-selectable'
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  yearsMapping = []

  isSearching: boolean = false
  updateAvailable: boolean = false
  validFormCustomStatus: boolean = false
  showDatePutIntoUseFilter: boolean = false
  showDatePutIntoUseFilterInput: boolean = true
  showManufactureYearFilterInput: boolean = true

  formGroup: FormGroup

  results: any[] = []
  index

  owners = ["CR", "ECOR", "ECR", "ER", "KR", "NCR", "NER", "NFR", "NR", "NWR", "SCR", "SECR", "SER", "SR", "SWR", "WCR", "WR"]
  vehiclesType = ["BCNHL", "BFNS", "BOBRNHSM1", "BOBSN", "BOBYN", "BOSTHSM2", "BOXNHL", "BOXNS", 'BRN22.9', "BTPGLN", "BVCM", "BVZI",]
  vehiclesTypeMapping = [{ id: "BCNA", name: "BCNA" }, { id: "BCNHL", name: "BCNHL" }, { id: "BFNS", name: "BFNS" }, { id: "BLCB", name: "BLCB" }, { id: "BOBRNHSM1", name: "BOBRNHSM1" }, { id: "BOBSN", name: "BOBSN" }, { id: "BOBYN", name: "BOBYN" }, { id: "BOBYNHS", name: "BOBYNHS" }, { id: "BOSTHSM2", name: "BOSTHSM2" }, { id: "BOXNHA", name: "BOXNHA" }, { id: "BOXNHL", name: "BOXNHL" }, { id: "BOXNHS", name: "BOXNHS" }, { id: "BOXNS", name: "BOXNS" }, { id: "BRN22.9", name: "BRN22.9" }, { id: "BTPGLN", name: "BTPGLN" }, { id: "BVCM", name: "BVCM" }, { id: "BVZI", name: "BVZI" }]
  manufacturersCode = ["ARC", "ASRW", "BESF", "BESWL", "BESWR", "BUR", "BWELK", "BWELZ", "BWT", "CIM", "CLW", "DLW", "DMW", "GOCW", "HEIB", "HEIS", "ICFW", "JMPW", "JRIL", "JWL", "MCFW", "MI", "OFPL", "RCFW", "SPJW", "SR", "TEXB", "TEXS", "TWL",]

  manufacturersCodeMapping = [{ id: "ARC", name: "Amtek Railcar Industries Pvt. Ltd." }, { id: "ASRW", name: "Amritsar Workshop   " }, { id: "BESF", name: "BESCO Ltd (Foundry), Kolkata " }, { id: "BESWL", name: "BESCO Ltd. (Wagon), Kolkata " }, { id: "BESWR", name: "BESCO Ltd (Wagon), Kolkata " }, { id: "BUR", name: "Burn Standard Co. Ltd. " }, { id: "BURH", name: "BUR Howrah" }, { id: "BWELK", name: "Bharat Wagon & Engineering Ltd." }, { id: "BWELZ", name: "Bharat Wagon & Engineering Ltd." }, { id: "BWT", name: "Braithwate & Co. Ltd., Kolkata" }, { id: "CIM", name: "CIMMCO Ltd, Bharatpur  " }, { id: "CLW", name: "Chittaranjan Locomotive Works  " }, { id: "DLW", name: "Diesel Locomotive Works  " }, { id: "DMW", name: "Diesel Loco Modernisation Works " }, { id: "GOCW", name: "Golden Rock Workshop, Trichurapalli " }, { id: "HEIB", name: "Hindustan Engineering Industries Ltd., Kolkata" }, { id: "HEIS", name: "Hindustan Engineering Industries Ltd., Kolkata" }, { id: "ICFW", name: "Integral Coach factory  " }, { id: "JMPW", name: "Jamalpur Workshop   " }, { id: "JRIL", name: "Jindal Rail Infrastructure Ltd, Vadodara Miyagam " }, { id: "JWL", name: "Jupiter Wagons Ltd, Chinsura, Hoogly" }, { id: "MCFW", name: "Modern Coach Factory  " }, { id: "MI", name: "Modern Industries (UP)  " }, { id: "OFPL", name: "Oriental Foundry Pvt Ltd " }, { id: "RCFW", name: "Rail Coach Factory  " }, { id: "SPJW", name: "Samastipur Workshop   " }, { id: "SR", name: "Sail RITES Bengal Wagon Industry Pvt. Ltd." }, { id: "TEXB", name: "Texmaco Rail and Engineering Ltd., Kolkata " }, { id: "TEXS", name: "Texmaco Rail and Engineering Ltd., Kolkata " }, { id: "TWL", name: "Titagarh, Howrah" },]

  /*  assetsTypeMapping = [{ id: "#", name: "Condemned Vehicle" }, { id: "A", name: "Ancillary vehicles, i.e., non-earning vehicles nec…Guard Vans in freight, Generator Cars in coaching" }, { id: "C", name: "Coaching (Passenger Carrying ONLY)" }, { id: "D", name: "DEMU" }, { id: "E", name: "EMU" }, { id: "F", name: "Freight (Earning vehicles ONLY)" }, { id: "L", name: "Electric Locos" }, { id: "M", name: "Maintenance related vehicles, e.g., Tower cars" }, { id: "P", name: "Part, i.e., an assembly/ subassembly, e.g., LHB bogie" }, { id: "R", name: "Rescue and safety related Vehicles, e.g., SPART/ SPARME, Cranes etc" }, { id: "S", name: "Diesel Locos" }, { id: "X", name: "Experimental, Vehicles on trial, e.g., the Talgo rake" }, { id: "Y", name: "Departmental (Freight)" }, { id: "Z", name: "Departmental (Coaching) includes saloons" },] */



  assetsTypeMapping = [{ id: "A", name: "Ancillary Vehicles" },
  { id: "C", name: "Coaching (Passenger Carrying ONLY)" },
  { id: "#", name: "Condemned Vehicle" },
  { id: "D", name: "DEMU" },
  { id: "Z", name: "Departmental (Coaching) includes saloons" },
  { id: "Y", name: "Departmental (Freight)" },
  { id: "S", name: "Diesel Locos" },
  { id: "L", name: "Electric Locos" },
  { id: "E", name: "EMU" },
  { id: "X", name: "Experimental Vehicles on trial" },
  { id: "F", name: "Freight (Earning vehicles ONLY)" },
  { id: "M", name: "Maintenance related vehicles" },
  { id: "P", name: "Part i.e. an assembly/ subassembly" },
  { id: "R", name: "Rescue and safety related Vehicles" }
  ]

  ownersMapping = [{ id: "CR", name: "CR" }, { id: "ECOR", name: "ECOR" }, { id: "ECR", name: "ECR" }, { id: "ER", name: "ER" }, { id: "KR", name: "KR" }, { id: "NCR", name: "NCR" }, { id: "NER", name: "NER" }, { id: "NFR", name: "NFR" }, { id: "NR", name: "NR" }, { id: "NWR", name: "NWR" }, { id: "SCR", name: "SCR" }, { id: "SECR", name: "SECR" }, { id: "SER", name: "SER" }, { id: "SR", name: "SR" }, { id: "SWR", name: "SWR" }, { id: "WCR", name: "WCR" }, { id: "WR", name: "WR" }]

  portChange(event: { component: IonicSelectableComponent, value: any }) {
    console.log('port:', event.value);
  }

  yomChange(event: { component: IonicSelectableComponent, value: any }) {
    console.log('YOM Change Event:', event.value);
    this.lessThan = ''
    this.moreThan = ''
    this.formGroup.controls['yearOfManufactureLessThan'].setValue('')
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue('')
  }

  makeQueryFromFormValue() {
    var query2 = '{'
    var dateUseSet: boolean = false

    Object.keys(this.formGroup.value).forEach(k => {
      if (this.formGroup.controls[k].value !== '') {
        if (k !== 'serialNo' && !k.match('dateUse')) {
          if (this.formGroup.controls[k].value.length > 1) {
            query2 += '"' + k + '":{"inq":['
            for (var i = 0; i < this.formGroup.controls[k].value.length; i++) {
              query2 += '"' + this.formGroup.controls[k].value[i].id + '"'
            }
            query2 += ']}'
          }
          else if (this.formGroup.controls[k].value[0] != undefined) {
            console.log(this.formGroup.controls[k].value[0].id)
            query2 += '"' + k + '":"' + this.formGroup.controls[k].value[0].id + '",'
          }
          else if (k === 'yearOfManufacture') {
            console.log('k=YOM and value is ', this.formGroup.controls[k].value)
            if (this.lessThan !== '' && this.moreThan !== '') {
              if (parseInt(this.moreThan.substring(2, 4)) < parseInt(this.lessThan.substring(2, 4))) {
                query2 += '"yearOfManufacture":{"between":["' + (parseInt(this.moreThan.substring(2, 4))+1) + '","' + (parseInt(this.lessThan.substring(2, 4))-1) + '"]},'
              }
              else {
                query2 += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2, 4) + '","lt":"' + this.lessThan.substring(2, 4) + '"},'
              }

            }
            else if (this.lessThan === '' && this.moreThan !== '') {
              query2 += '"yearOfManufacture":{"gt":"' + this.moreThan.substring(2.4) + '"},'
            }
            else if (this.moreThan === '' && this.lessThan !== '') {
              query2 += '"yearOfManufacture":{"lt":"' + this.lessThan.substring(2.4) + '"},'
            }
          }
        }
        else if (this.formGroup.controls[k].value != undefined) {
          console.log(this.formGroup.controls[k].value)
          if (k === 'serialNo') {
            query2 += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
          }
          else if (!dateUseSet) {
            if (this.formGroup.controls['dateUseLessThan'].value !== '' && this.formGroup.controls['dateUseMoreThan'].value !== '') {
              if (new Date(this.formGroup.controls['dateUseMoreThan'].value) > new Date(this.formGroup.controls['dateUseLessThan'].value)) {
                query2 += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '","lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              }
              else {
                query2 += '"dateUse":{"between":["' + this.formGroup.controls['dateUseMoreThan'].value + '","' + this.formGroup.controls['dateUseLessThan'].value + '"]},'
              }
              dateUseSet = true;
            }
            else if (this.formGroup.controls['dateUseLessThan'].value === '' && this.formGroup.controls['dateUseMoreThan'].value !== '') {
              query2 += '"dateUse":{"gt":"' + this.formGroup.controls['dateUseMoreThan'].value + '"},'
              dateUseSet = true;
            }
            else if (this.formGroup.controls['dateUseMoreThan'].value === '' && this.formGroup.controls['dateUseLessThan'].value !== '') {
              query2 += '"dateUse":{"lt":"' + this.formGroup.controls['dateUseLessThan'].value + '"},'
              dateUseSet = true;
            }
            else if (k === 'dateUse') {
              query2 += '"' + k + '":"' + this.formGroup.controls[k].value + '",'
              dateUseSet = true;
            }
          }
        }
      }
    })
    query2 += '}.'
    console.log('Query2 Before Split', query2)
    query2 = query2.split('""').join('","')
    query2 = query2.split('}"').join('},"')
    query2 = query2.split(',}.').join('}')
    query2 = query2.split('}.').join('}')
    console.log('Query2 After Split', query2)
    return query2
  }

  constructor(public fb: FormBuilder, public http: HttpClient, public toastController: ToastController, public alertController: AlertController, public modalCtrl: ModalController, public httpProvider: HttpProvider, public swUpdate: SwUpdate
  ) {
    console.log('Constructor')
    this.swUpdate.available.subscribe(event => {
      this.updateAvailable = true
      console.log('Update Available')
      this.presentToast("Update Available. Kindly Refresh.", 2000)
    })

    //making of yearsMapping. Should not be commented.
    for (var i = 2019; i > 1969; i--) {
      var year = i + ''
      this.yearsMapping.push({ id: (i + '').substring(2, 4), name: '' + i })
    }
    // console.log(this.yearsMapping)
  }

  ngOnInit() {
    console.log('ngOnInit')
    this.formInit()
    // this.presentAlertRadio()
  }

  formInit() {
    var arr = []
    this.formGroup = this.fb.group({
      'yearOfManufactureLessThan': [''],
      'yearOfManufactureMoreThan': [''],
      "invalidDateRange": [''],
      'assetType': [arr],
      'yearOfManufacture': [arr],
      'owner': [arr],
      'vehicleType': [arr],
      'serialNo': [''
        , [Validators.pattern('[0-9]{1,6}'), Validators.min(0), Validators.max(999999)]
      ],
      'dateUse': [''],
      'dateUseLessThan': [''],
      'dateUseMoreThan': [''],
      'vehicleMfcCode': [arr],
    },
      {
        validator: this.customValidator.bind(this)
      }
    );
  }

  validateDate(formGroup, k) {
    if (formGroup.controls[k].value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      //pattern is matching. 
      //date maybe invalid like 50 Jan or 32 MMM
      //date is jumping like 31 apr is treated as 1 may
      if (new Date(formGroup.controls[k].value) + '' !== 'Invalid Date') {
        //date is valid like 30 apr or 31 apr or 31 Feb
        if (new Date(formGroup.controls[k].value).toISOString().slice(0, 10) !== formGroup.controls[k].value) {
          // 31 Feb jumps to march
          // for js, 30 Apr is valid. Also 31 Apr is valid but presented as 1 May. ie date jumps
          formGroup.controls[k].setErrors({ incorrect: true })
          console.log('Invalid Date: Date is Jumping.')
          formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
        }
        // date is not jumping
        else {
          // valid pattern and valid date and no jumps
          console.log('Pattern Matched. Valid Date. No Jumps.')
        }
      }
      else {
        //date is invalid eg 50 Feb
        formGroup.controls[k].setErrors({ incorrect: true })
        console.log('Invalid Date: Value like 32 Jan/50 Mar.')
        formGroup.controls['invalidDateRange'].setErrors({ incorrect: true })
      }
    }
    else {
      //pattern not matching
      formGroup.controls[k].setErrors({ incorrect: true })
      console.log('Invalid Date: Format other than YYYY-MM-DD.')
      formGroup.controls['invalidDateRange'].setErrors(null)
    }
  }

  customValidator(formGroup: FormGroup) {
    var atLeastOneIsFilled: boolean = false
    if (formGroup.controls['dateUse'].value !== '') {
      this.validateDate(formGroup, 'dateUse')
    }
    if (formGroup.controls['dateUseLessThan'].value !== '') {
      this.validateDate(formGroup, 'dateUseLessThan')
    }
    if (formGroup.controls['dateUseLessThan'].value !== '') {
      this.validateDate(formGroup, 'dateUseLessThan')
    }

    for (var key in formGroup.controls) {
      if ((formGroup.controls[key].value && formGroup.controls[key].value.length > 0)) {
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
    this.isSearching = true

    //0 padding for serial number
    var map = ['00000', '0000', '000', '00', '0']
    if (this.formGroup.controls['serialNo']) {
      if (this.formGroup.controls['serialNo'].value.length < 6 && this.formGroup.controls['serialNo'].value !== '') {
        console.log('Before padding:', this.formGroup.controls['serialNo'].value)
        console.log('serial no length:', this.formGroup.controls['serialNo'].value.length)
        this.formGroup.controls['serialNo'].setValue(map[this.formGroup.controls['serialNo'].value.length - 1] + this.formGroup.controls['serialNo'].value)
      }
      console.log('After padding:', this.formGroup.controls['serialNo'].value)
    }

    var jsonData = this.formGroup.value
    console.log('Form Value as String:', JSON.stringify(this.formGroup.value))
    Object.keys(jsonData).forEach(k => (!jsonData[k] && jsonData[k] !== undefined) && delete jsonData[k]);
    console.log('Form value as string:', JSON.stringify(this.formGroup.value))
    console.log(jsonData)
    console.log('Form value after Shrink:', this.formGroup.value)
    this.querySummaryString = jsonData
    this.formGroup.controls['yearOfManufactureLessThan'].setValue('')
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue('')

    var queryString = this.makeQueryFromFormValue()

    this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
    var fields = ',"fields":{"owner":"true","dateUse":"true","yearOfManufacture":"true","assetType":"true","serialNo":"true","vehicleType":"true","vehicleMfcCode":"true"}'

    //condemned Vehicle id is # which cannot be directly accessed by LB.
    queryString = queryString.split('#').join('%23')
    console.log('This is query:', '{"where":' + queryString + fields + '}')

    let timeoutPromise = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve('Connection Timed Out');
      }, 5000)
    })
    let responsePromise = this.httpProvider.getMethod('/Tags/v2/EPC/qbe?filter=' + '{"where":' + queryString + fields + '}').toPromise()
    let race = Promise.race([timeoutPromise, responsePromise])
    race.then((data: any) => {
      console.log('Race Response: ', data)
      if (data === 'Connection Timed Out') {
        console.log(data)
        this.presentToast('Unable to Connect now.', 2000)
      }
      else {
        console.log('HTTP GET Result: ', data)
        if (data.name === 'error') {

        } else {
          this.results = data
          if (this.results.length > 0) {
            this.showResults(0)
            this.showDatePutIntoUseFilter = false
            this.showDatePutIntoUseFilterInput = false
            this.showManufactureYearFilterInput = false
            // this.removeDuplicates()
          }
          else {
            this.presentToast('No Result Found', 1500)
          }
        }
      }
    }, error => {
      console.log("Error: ")
      console.log(error)
      this.presentToast('Unable to Connect.', 1500)
    }).finally(() => {
      this.isSearching = false
    })
  }

  getItem(mapping, value) {
    var found: boolean = false
    for (var i = 0; i < mapping.length; i++) {
      if (mapping[i].id === value) {
        console.log('Match found', mapping[i])
        found = true
        return [mapping[i]]
      }
    }
    if (!found) {
      console.log('No Match Found. Returning:', [])
      return [{ id: value, name: value }]
    }

  }
  showResults(index: any) {

    console.log('Showing Reults. Index is: ', index)
    this.index = index
    console.log(this.results[0].yearOfManufacture)
    this.formGroup.controls['assetType'].setValue(this.getItem(this.assetsTypeMapping, this.results[index].assetType))
    this.formGroup.controls['yearOfManufacture'].setValue(this.getItem(this.yearsMapping, this.results[index].yearOfManufacture))
    this.formGroup.controls['owner'].setValue(this.getItem(this.ownersMapping, this.results[index].owner))
    this.formGroup.controls['vehicleType'].setValue(this.getItem(this.vehiclesTypeMapping, this.results[index].vehicleType))
    this.formGroup.controls['dateUse'].setValue(this.results[index].dateUse.substring(0, 10))
    this.formGroup.controls['vehicleMfcCode'].setValue(this.getItem(this.manufacturersCodeMapping, this.results[index].vehicleMfcCode))
    this.formGroup.controls['serialNo'].setValue(this.results[index].serialNo)
  }

  showPrevious() {
    console.log('Showing Previous')
    console.log('Current:', this.results[this.index])
    console.log("Previous:", this.results[this.index - 1])
    if (JSON.stringify(this.results[this.index]) === JSON.stringify(this.results[this.index - 1])) {
      console.log("Current and Previous is same.")
    }
    else {
      console.log("Current and Previous is not the same.")
    }
    this.showResults(this.index - 1)
  }

  showNext() {
    console.log("Showing Next")
    this.showResults(this.index + 1)
  }

  async presentToast(msg: string, duration) {
    const toast = await this.toastController.create({
      message: msg,
      translucent: false,
      duration: duration,
      position: "top"
    });
    toast.present();
  }

  clearForm() {
    this.results = []
    var arr = []
    this.moreThan = ''
    this.lessThan = ''
    this.manufacturedYearFilterValue = ''
    this.dateUseFilterValue = ''
    this.formInit()
  }

  numberOnly(event): boolean {
    console.log('Keypress Event: ')
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  querySummaryString = ''
  showQuerySummary() {
    var queryString = this.querySummaryString
    if (this.querySummaryString !== '') {
      //User has made a search and viewing the query summary
      //here the form value before search is show.
      var formValue = this.formGroup.value
      var result = this.results[this.index]
      var arrayUndefined = false

      //Clearing Form Value of keys where value ===""
      Object.keys(formValue).forEach(k => (!formValue[k] && formValue[k] !== undefined) && delete formValue[k]);
      console.log('Query String:', queryString)
      console.log('From String:', formValue)
      console.log('Result String:', result)

      //flag if any of the formcontrol array is undefined/len<=0
      //this cound happen if user clears form control array after search results is loaded and before hitting the eye
      Object.keys(formValue).forEach(k => {
        if (formValue[k].length <= 0) {
          arrayUndefined = true
        }
      })
      //run check if the user has modified the form after hitting the search button and before hitting eye
      if (!arrayUndefined
        && result !== undefined
        && result.assetType === formValue.assetType[0].id
        && result.yearOfManufacture === formValue.yearOfManufacture[0].id
        && result.owner === formValue.owner[0].id
        && result.vehicleType === formValue.vehicleType[0].id
        && result.dateUse.substring(0, 10) === formValue.dateUse
        && result.vehicleMfcCode.substring(0, 10) === formValue.vehicleMfcCode[0].id
        && parseInt(result.serialNo) === parseInt(formValue.serialNo)
      ) {
        //user has not modified the fields after loading results and before hitting the eye
        //no change in queryString here
        console.log(' ##Match##')
      }
      else {
        //user has  modified the fields after loading results and before hitting the eye
        //point query String to the form value
        console.log(' ##No Match##')
        queryString = formValue
      }
    }
    else {
      queryString = this.formGroup.value
    }
    this.presentModal("", queryString, 'querySummary', 'Query Summary')
  }

  async presentInvalidDateRange(message) {
    const alert = await this.alertController.create({
      header: 'Invalid Date Range',
      message: message,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    await alert.present();
  }

  async openCalendar(k, title) {
    const options: CalendarModalOptions = {
      title: title,
      canBackwardsSelected: true,
      autoDone: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    if (date != null) {
      console.log('Date Value:', date.string);
      this.formGroup.controls[k].setValue('' + date.string)
    }

  }

  showDateUseCalendar(k) {
    // if (this.formGroup.controls['dateUse'].value === '') {
    this.openCalendar('dateUse', 'Date Put Into Use')
    // }
  }

  //https://github.com/HsuanXyz/ion2-calendar

  assetMapping(value) {
    var found = false
    for (var j = 0; j < this.assetsTypeMapping.length; j++) {
      if (this.assetsTypeMapping[j].id === value) {
        found = true
        return this.assetsTypeMapping[j].name
      }
    }
    if (!found) {
      return value
    }
  }

  vehicleMfcCodeMapping(value) {
    var found = false
    for (var j = 0; j < this.manufacturersCodeMapping.length; j++) {
      if (this.manufacturersCodeMapping[j].id === value) {
        return this.manufacturersCodeMapping[j].name
      }
    }
    if (!found) {
      return value
    }
  }
  makeExcel() {
    console.log('Download Start' + new Date())
    var excelResult = []
    for (var i = 0; i < this.results.length; i++) {
      excelResult.push(
        {
          'Asset Type': this.assetMapping(this.results[i].assetType) + '',
          'Owner': this.results[i].owner,
          'Serial No.': this.results[i].serialNo,
          'Manufacturer Code': this.vehicleMfcCodeMapping(this.results[i].vehicleMfcCode) + '',
          'Vehicle Type': this.results[i].vehicleType,
          'Manufacture Year': this.results[i].yearOfManufacture

        }
      )
    }
    console.log('Mapped Excel Results:', excelResult)
    // let sheet = XLSX.utils.json_to_sheet(this.results);
    let sheet = XLSX.utils.json_to_sheet(excelResult);
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
    console.log('Download End' + new Date())
  }

  removeDuplicates() {
    console.log('Removing Duplicates')
    console.log('Start Time:', new Date())
    var uniqueResults = []
    var found: boolean = false
    Object.keys(this.results).forEach(k => {
      // console.log('results item:', this.results[k])
      Object.keys(uniqueResults).forEach(m => {
        // console.log('uniqueResult item:', uniqueResults[m])
        if (JSON.stringify(this.results[k]) === JSON.stringify(uniqueResults[m])) {
          found = true
        }
        else {
          found = false
        }
      });
      if (!found) {
        uniqueResults.push(this.results[k])
      }
    });
    console.log(uniqueResults)
    this.results = uniqueResults
    console.log('End Time:', new Date())
  }

  yearOfManufactureFilter() {
    console.log('YOM Filtering')
    this.presentYearOfManufactureFilter()
  }


  enableDatePutIntoUseFilter() {
    console.log('Date Put Into Use Filter')
    if (this.showDatePutIntoUseFilter) {
      this.showDatePutIntoUseFilter = false
    }
    else {
      this.showDatePutIntoUseFilter = true
    }

  }


  lessThan = ''
  moreThan = ''

  async presentYearOfManufactureFilter() {

    const alert = await this.alertController.create({
      header: 'Manufacture Year Filter',
      inputs: [
        {
          label: 'After',
          name: 'moreThan',
          type: 'text',
          id: 'name2-id',
          value: this.moreThan,
          placeholder: 'After YYYY'
        }, {
          label: 'Before',
          name: 'lessThan',
          type: 'text',
          id: 'name1-id',
          value: this.lessThan,
          placeholder: 'Before YYYY'
        }],
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Clear',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Clear');
            this.lessThan = ''
            this.moreThan = ''
            this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
            this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log('Data:', data)
            console.log(this.lessThan.match(/^\d{4}$/))
            // match(/^\d{4}$/)
            if (data.lessThan.match(/^\d{4}$/)) {
              if (parseInt(data.lessThan) > parseInt(new Date('1968-01-01').toISOString().slice(0.10)) && parseInt(data.lessThan) <= parseInt(new Date().toISOString().slice(0.10)) + 1) {
                // if (parseInt(data.lessThan) > 1968 && parseInt(data.lessThan) < 2021) {
                console.log('Match. >1970. <2020')
                this.lessThan = data.lessThan
                this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
              }
            }

            if (data.moreThan.match(/^\d{4}$/)) {
              if (parseInt(data.moreThan) > 1968 && parseInt(data.moreThan) <= parseInt(new Date().toISOString().slice(0, 10)) + 1) {
                console.log('Match. >1970. <2020')
                this.moreThan = data.moreThan
                this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)
              }
            }
            if ((this.lessThan === '' && data.lessThan !== '') || (this.moreThan === '' && data.moreThan !== '')) {
              this.presentInvalidDateRange('Invaild Date Range.')
            }


          }
        }
      ]
    });
    await alert.present();
  }
  dateUseFilterValue = ''
  manufacturedYearFilterValue = ''

  async presentModal(message, queryString, type, title) {
    console.log('Present Modal')
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        value: message, queryString: queryString, type: type, title: title,
        dateUseLessThan: this.formGroup.controls['dateUseLessThan'].value,
        dateUseMoreThan: this.formGroup.controls['dateUseMoreThan'].value,
        manufacturedBefore: this.formGroup.controls['yearOfManufactureLessThan'].value,
        manufacturedAfter: this.formGroup.controls['yearOfManufactureMoreThan'].value
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log('Data AFter Moda Close:', data);
    console.log(data === undefined)
    // console.log(data===undefined)
    if (data !== undefined) {
      if (this.formGroup.controls['dateUseLessThan'].value !== data.dateUseLessThan || this.formGroup.controls['dateUseMoreThan'].value !== data.dateUseMoreThan) {
        console.log('Date Use Filter Change Detected')
        this.showDatePutIntoUseFilterInput = true
      }
      if (this.formGroup.controls['yearOfManufactureLessThan'].value !== data.manufacturedBefore || this.formGroup.controls['yearOfManufactureMoreThan'].value !== data.manufacturedAfter) {
        console.log('Date Use Filter Change Detected')
        this.showManufactureYearFilterInput = true
      }
      this.formGroup.controls['dateUseLessThan'].setValue(data.dateUseLessThan)
      this.formGroup.controls['dateUseMoreThan'].setValue(data.dateUseMoreThan)
      this.lessThan = data.manufacturedBefore
      this.moreThan = data.manufacturedAfter
      console.log(this.lessThan, this.moreThan)
      if (data.dateUseLessThan !== '' && data.dateUseMoreThan !== '') {
        this.dateUseFilterValue = 'After: ' + data.dateUseMoreThan + ' Before: ' + data.dateUseLessThan
      }
      if (data.dateUseLessThan === '' && data.dateUseMoreThan !== '') {
        this.dateUseFilterValue = 'After: ' + data.dateUseMoreThan
      }
      if (data.dateUseLessThan !== '' && data.dateUseMoreThan === '') {
        this.dateUseFilterValue = 'Before: ' + data.dateUseLessThan
      }
    }

    this.formGroup.controls['yearOfManufactureLessThan'].setValue(this.lessThan)
    this.formGroup.controls['yearOfManufactureMoreThan'].setValue(this.moreThan)


    if (this.lessThan !== '' && this.moreThan !== '') {
      if (parseInt(this.lessThan) > parseInt(this.moreThan)) {
        this.manufacturedYearFilterValue = 'M/f B/w: ' + this.moreThan + '-' + this.lessThan
      }
      else {
        this.manufacturedYearFilterValue = 'Before: ' + this.moreThan + ' After: ' + this.lessThan
      }
    }
    if (this.lessThan === '' && this.moreThan !== '') {
      this.manufacturedYearFilterValue = 'After: ' + this.moreThan
    }
    if (this.lessThan !== '' && this.moreThan === '') {
      this.manufacturedYearFilterValue = ' Before: ' + this.lessThan
    }
  }

  test = [{ id: 'Init Value', name: 'Init Value' }]
  changeDetected(event) {
    // this.ownersMapping.push(this.test[0])
    console.log('Change Detected:', event)
  }

  inputClicked() {
    console.log('Input Clicked')
  }

  clearDateUse(k) {
    if (k === 'dateUse') {
      this.formGroup.controls['dateUse'].setValue('')
    }
    if (k === 'dateUseFilterValue') {
      this.formGroup.controls['dateUseLessThan'].setValue("")
      this.formGroup.controls['dateUseMoreThan'].setValue("")
      this.dateUseFilterValue = ''
    }
  }
}
