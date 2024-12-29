import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }

  SuccessAlert(title: any, msg: any) {
    Swal.fire(title, msg, "success")
  }
  WarningAlert(title: any, msg: any) {
    Swal.fire(title, msg, "warning")
  }
  ComfirmAlert(title: any, confirmBtnTxt: any, cancelBtnTxt: any, desc: any = "", isShowCancelBtn: boolean = true) {
    return Swal.fire({
      title: title,
      icon: 'info',
      showCancelButton: isShowCancelBtn,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: confirmBtnTxt,
      cancelButtonText: cancelBtnTxt,
      allowOutsideClick: false
    })
  }
}
