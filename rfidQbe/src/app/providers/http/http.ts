

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as constants from '../../constants/constants'

@Injectable()
export class HttpProvider {

    constructor(private httpClient: HttpClient) { }
    public getMethod(url) {

        return this.httpClient.get(constants.BASE_URL+ url)
    }

    publicInitOwners(){
        return this.httpClient.get('../../assets/data/data.json')
    }

}








