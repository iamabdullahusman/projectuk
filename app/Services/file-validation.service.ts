import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {
  toastr: any;
  fileTypes = [];
  fileEMLTypes = [];
  constructor() {
    this.fileTypes = ['png', 'jpg', 'jpeg', 'pdf', 'doc'];
    this.fileEMLTypes = ['eml'];
  }

  checkFileType(files: any) {

    for (let file of files) {
      if (this.fileTypes.indexOf(file.type.split('/')[1]) === -1) {
        return false;
      }
    }
    return true;
  }
  checkEMLFileType(files: any) {

    for (let file of files) {
      if (this.fileEMLTypes.indexOf(file.name.split('.')[1]) === -1) {
        return false;
      }
    }
    return true;
  }
}



