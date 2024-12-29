import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
@Injectable({
   providedIn: 'root'
})
export class AppConfig {
   constructor() { }

   // baseServiceUrl: string = " https://1298-103-238-108-241.in.ngrok.io/";
   //baseServiceUrl: string = "http://86.48.5.215:8081/"; //Xeotech Test Server
   //baseServiceUrl: string = "http://localhost:8081/"; //Local IIS
   //baseServiceUrl: string = "http://10.150.2.131:8081/"; //Mysystem Server
   baseServiceUrl: string = environment.api_url;
   //baseServiceUrl: string = "http://157.173.195.241:8081/"; //Inovedia Main Server
   //prod server
   //baseServiceUrl: string = "https://intranet.ufp.uk.com/backbone/"; //ufp production server
   
}