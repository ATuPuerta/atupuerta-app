import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Config {
  url = "http://10.42.0.232:8080";

  limitAnunciosFree = 3;
  
  constructor() { }
}
