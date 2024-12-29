import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DatetimeService {
  constructor() {}

  setWriteOffset(date: Date) {
    const timeZone = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - timeZone);
  }
  setReadOffset(date: Date) {
    const timeZone = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() + timeZone);
  }
}
