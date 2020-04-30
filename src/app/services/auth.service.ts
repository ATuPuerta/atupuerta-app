import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthApi } from './api/auth.api';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  username:string = "Anonymous";
  profilePicture:string = null;

  constructor(
    private storage: NativeStorage,
    private authApi: AuthApi
  ) { }

  login(username: string, password: string) {
    let self = this;
    return new Promise( (resolve, reject) => {
      self.authApi.login( username, password ).subscribe(
        data => {
            if( data && data.token ){
                self.token = data;
                self.isLoggedIn = true;
                self.username = username
                self.profilePicture = data.profile_picture;
                data.username = username
                
                self.storage.setItem('token', data)
                .then(
                  () => {
                    console.log('Token Stored');
                  },
                  error => console.error('Error storing item: Token', error)
                ); 
                return resolve(true);
            }

            return resolve(false);
          },
          error => {
            console.log(error); 
            return reject(false)
          },() => {
              return reject(false)
          });
    });
  }

  register(params) {
    return new Promise( (resolve, reject) => {
      this.authApi.register( params, {fields:'id'} ).subscribe(
        data => {
          resolve(true);
        },
        error => {
          reject(false);
        },
        () => {
          
        }
      );
    });
  }

  logout() {
        this.storage.remove("token");
        this.storage.remove("user");
        this.isLoggedIn = false;
        delete this.token;
        this.username = "Anonymous";
        this.profilePicture = null;
        return { message:"logout ok" };
  }

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        this.username = data.username;
        this.profilePicture = data.profile_picture;

        if(this.token != null ) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }

  getAuthorization( ){
    if( !this.token ) return null;

    if( this.token.expiration && new Date(this.token.expiration).getTime() > Date.now() )
      return "Bearer "+ this.token.token;

    return null;
  }
}
