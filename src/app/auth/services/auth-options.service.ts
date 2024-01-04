/** This file containes authentication and login related functions 
* author : T.Nanda Kumar
*/
import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment"
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Route, ActivatedRoute} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import permission_list from './permissions';

@Injectable()
export class AuthOptionsService{
    logedUserPermission: string[] = [] // To store current user permissions
    user_data:any;
    en_key: string ='123456$#@$^@1ERF';

    encryption_format: {} = {
        keySize: 128 / 8,
        iv: this.en_key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    
    constructor(private http: HttpClient,
        private authService: NbAuthService,
        private route: ActivatedRoute){
    }

    checkEmailPresent: any = false;
    
    /**
     * Checks email exist in database
     * @param emailValue 
     * @returns  
     * 
     */
    checkEmailExist(emailValue:string, accountType:string){
        return this.http.post(environment["baseUrl"] + "password/checkEmailExist", { "email": emailValue, "accountType": accountType });
    } 
    
    /**
     * Gets user permission from server
     * @param user_id 
     */
    setUserPermissons(permission:any){
        let value = JSON.stringify(permission);
        let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), this.en_key,
            this.encryption_format);
        localStorage.setItem("usr_prm", encrypted.toString());
        this.logedUserPermission = permission;
    }

    checkPermissionById(permission_id: number){
        let usr_permission = localStorage.getItem("usr_prm");
        let prm_json       = this.decodeEncryption(usr_permission);
        let prm_array      = JSON.parse(prm_json);
        this.logedUserPermission = prm_array;
        return prm_array.includes(permission_id);
    }


    checkPermissionByName(name:string){
        let usr_permission = localStorage.getItem("usr_prm");
        let prm_json       = this.decodeEncryption(usr_permission);
        let prm_array      = JSON.parse(prm_json);
        return prm_array.includes(permission_list[name].id);
    }

    decodeEncryption(value:string){
        var decrypted = CryptoJS.AES.decrypt(value, this.en_key, this.encryption_format);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    clearUserPermission(){
        this.logedUserPermission = [];
    }

    /**
     * Gets user type of current loged in user
     * @returns  user type
     * 
     */
    getUserType(){
        return localStorage.getItem("user_type");
    }
}