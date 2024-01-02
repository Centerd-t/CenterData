import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_CONFIGURATION } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { ConfirmationService } from 'primeng/api';
import { NbDialogService } from '@nebular/theme';

import { UsersService } from "../services/users.service";
import { HttpStatusCode } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  AddCenterDataForm: FormGroup;

  itemsPerPage: any[] = [10, 25, 50];
  users: any;
  columns: any[]; // for table columns

  first = 0;
  rows = 10;
  userid: any;

  constructor(
    private toastrService: NbToastrService,
    private userService: UsersService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.AddCenterDataFormInitialize();
    // table   with their respective field name and header value
    this.columns = [
      { field: "name", header: "File Name", show: true, sort: true },
      { field: "date", header: "Date", show: true, sort: true },
    ];


  }

  /**
   * CenterData Form Initialize
   */

  AddCenterDataFormInitialize() {
    // const currentDate = new Date();
    // currentDate.setHours(0, 0, 0); // Set time to 00:00:00

    this.AddCenterDataForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      period: [null, [Validators.required]],
    });
  }
  /**
   * Download File 
   * @param 
   * @returns
   */
  //   downloadFile(user: any) {
  //     let byteArray = UintArray.from
  //     atob(base64String)
  // • split('')
  // • map(char => char.charCodeAt(0))

  //     let blobfile = new Blob([byteArray], { type: 'application/pdf' });
  //     saveAs(blobfile, filename.extension)
  //   }

  ondownloadFile(fileName: string, byteCode: string | null) {
    if (byteCode) {
      const blob = new Blob([atob(byteCode)], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  }

  /**
   * Company List
   * @param null
   * @returns
   */
  onSubmit() {

    const selectedDate = this.datePipe.transform(this.AddCenterDataForm.value.date, 'yyyy-MM-dd');
    const selectedPeriod = this.AddCenterDataForm.value.period;

    // Combine date, time, and period
    const combinedDateTime = `${selectedDate} ${selectedPeriod}`;


    this.userService.getCenterDataList(combinedDateTime).subscribe(
      (response) => {
        this.users = response;
        if (HttpStatusCode.Ok) {
          this.toastrService.show(response["message"], "Success", {
            status: "success",
            duration: 8000,
          });
        } else {
          this.toastrService.show(response["message"], "Warning", {
            status: "warning",
            duration: 8000,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


}