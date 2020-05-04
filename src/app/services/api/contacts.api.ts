import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Config } from './../../../../config';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})

export class ContactsApi {

    constructor(
        private http: HttpClient,
        private config: Config,
        private authService: AuthService,
    ) { }

    send( text:string ) {
        let params = {
            text
        };

        let headers = new HttpHeaders();

        let token = this.authService.getAuthorization();

        if( !token ){
            return Observable.create( subscriber => {
                subscriber.error( { message:"Necesitas estar logueado para realizar esta acción" } );
            } );
        }

        headers = headers.append("authorization", token);
        headers = headers.append("content-type", "application/json");

        return this.http.post<any>(this.config.url + '/v1/feedback', params, { headers } ).pipe(
            map(data => data),
            catchError(this.handleError)
        );
    }

    private handleError(res: HttpErrorResponse | any) {
        return observableThrowError(res.error || 'Server error');
    }

}
