import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import dayjs from "dayjs";

@Injectable({
  providedIn: "root",
})
export class CustomValidationService {
  constructor() {}

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  // This validator is used to check whether student's mail id and parent's mail id not same
  CompareMailId(studentEmail: string, parentEmail: string) {
    return (formGroup: FormGroup) => {
      const studentEmailControl = formGroup.controls[studentEmail];
      const parentEmailControl = formGroup.controls[parentEmail];

      if (!studentEmailControl || !parentEmailControl) {
        return null;
      }

      if (studentEmailControl.errors && !parentEmailControl.errors.matched) {
        return null;
      }

      if (studentEmailControl.value === parentEmailControl.value) {
        parentEmailControl.setErrors({ matched: true });
      } else {
        parentEmailControl.setErrors(null);
      }
    };
  }

  dateRangeValidation(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const startDateControl = formGroup.controls[startDate];
      const endDateControl = formGroup.controls[endDate];
      if (!startDateControl.value || !endDateControl.value) {
        return null;
      }

      if (dayjs(startDateControl.value).isAfter(endDateControl.value)) {
        endDateControl.setErrors({ invalidRange: true });
      }
    };
  }

  timeRangeValidation(startTime: string, endTime: string) {
    return (formGroup: FormGroup) => {
      const startTimeControl = formGroup.controls[startTime];
      const endTimeControl = formGroup.controls[endTime];
      if (
        !startTimeControl.value ||
        !endTimeControl.value ||
        !startTimeControl.value.includes(":") ||
        !endTimeControl.value.includes(":")
      ) {
        return null;
      }
      const startTimeSplit = startTimeControl.value.split(":");
      const endTimeSplit = endTimeControl.value.split(":");
      const totalStartTime =
        parseInt(startTimeSplit[0]) * 60 + parseInt(startTimeSplit[1]);
      const totalEndTime =
        parseInt(endTimeSplit[0]) * 60 + parseInt(endTimeSplit[1]);
      if (totalStartTime > totalEndTime) {
        endTimeControl.setErrors({ invalidRange: true });
      }
    };
  }
}
