import { Component , OnInit } from '@angular/core';
import intlTelInput from 'intl-tel-input';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
  title = 'ArchitectUI - Angular 12 Bootstrap 5 & Material Design Admin Dashboard Template';
  ngOnInit(): void {
  //   Promise. resolve().then(()=>{
  //     console.log(" Foorter compnent");
      
  //       const inputElement = document.querySelector("#phone5656565")as HTMLInputElement ;
  //       console.log("inputElement:", inputElement);
  
  //       if (inputElement) {
  //         console.log("into the function")
  //         intlTelInput(inputElement, {
  //           initialCountry: 'us',
  //           separateDialCode: true,
  //           utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
  //         });
  //       } else {
  //         console.error("Input element with ID 'phone5656565' not found.");
  //       }})
  }

}
