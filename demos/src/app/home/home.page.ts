import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private menu: MenuController,public device:Device,public plt: Platform){
    console.log(device.cordova)
    console.log(device.isVirtual)
    console.log(device.manufacturer)
    console.log(device.model)
    console.log(device.platform)
    console.log(device.serial)
    console.log(device.uuid)
    console.log(device.version)

    console.log("Platform:",plt)
    console.log("Platform:",plt.platforms())
    console.log("Platform:",plt.)
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  menuClose(){
    console.log('Closing')
    // this.menu.close()
  }


}
