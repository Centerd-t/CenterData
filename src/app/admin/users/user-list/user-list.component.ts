import { Component, OnInit } from '@angular/core';
import { UsersService } from "../services/users.service";
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
    private userService: UsersService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.AddCenterDataFormInitialize();
    // table   with their respective field name and header value
    this.columns = [
      { field: "date", header: "Date", show: true, sort: true },
      { field: "name", header: "File Name", show: true, sort: true },
    ];
  }

  /**
   * CenterData Form Initialize
   */

  AddCenterDataFormInitialize() {
    this.AddCenterDataForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      session: [null, [Validators.required]],
    });
  }
  /**
   * Download File 
   * @bytecode
   */
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
    const selectedSession = this.AddCenterDataForm.value.session;

    this.userService.getCenterDataList(selectedDate, selectedSession).subscribe(
      (response) => {
        this.users = response;
      },
            (error) => {
        console.log(error);
      }
    );
  }


}