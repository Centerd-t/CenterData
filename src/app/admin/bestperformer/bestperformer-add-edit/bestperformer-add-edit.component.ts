import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BestperformerService } from '../services/bestperformer.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { Subscription, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ROUTE_PATH } from '../../../shared/constants/route-path.constant';

@Component({
  selector: 'ngx-bestperformer-add-edit',
  templateUrl: './bestperformer-add-edit.component.html',
  styleUrls: ['./bestperformer-add-edit.component.scss']
})
export class BestperformerAddEditComponent implements OnInit {

  AddUserForm: FormGroup;
  submitted = false;
  //page_title: string;
  data_loading = false;
  
  //show password
  showPassword =true;

  //userlist pass user data
  userDetails: any;
  page_title: string;

  results: any[] = [];

  private userSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private userService: BestperformerService,
    private toastrService: NbToastrService,
    private datePipe: DatePipe,
    
  ) { }


  ngOnInit(): void {
    this.AddUserFormInitialize();

    if (this.router.url.indexOf("edit") !== -1) {
      // this.data_loading = true;
      const id = this.aRoute.snapshot.paramMap.get("title");
      this.page_title = "Edit Bestperformer";
    } else {
      this.page_title = "Add Bestperformer";
      this.AddUserForm.reset();
    }


   // Check if user details are passed user list, service to user-edit

   this.userSubscription = this.userService.getUserDetails().subscribe(user => {     if (user) {
      this.userDetails = user;
      console.log(this.userDetails)
      // Pre-fill the form with user details
      this.AddUserForm.patchValue({
        name: this.userDetails.name,
        sales: this.userDetails.sales,
        remarks: this.userDetails.remarks,
        fdate: new Date(this.userDetails.fdate), // Assuming 'fdate' is a date field
        tdate: new Date(this.userDetails.tdate),
       });
      }else {
      this.AddUserForm.reset(); // Ensure the form is reset when no user details are present
      }
   });
   
    // Subscribe to changes in the 'name' control and make API requests
    this.AddUserForm.get('name').valueChanges.pipe(
      debounceTime(300),
      switchMap((name) => {
        // Make the API request only if the name has at least 3 characters
        if (name.length >= 4) {
          return this.userService.getReferralIds(name);
        } else {
          // Return an empty observable if the input length is less than 3 characters
          return of([]);
        }
      })  
        ).subscribe((response) => {
      this.results = response;
    });
  
  } 

  ngOnDestroy(): void {
    // Unsubscribe to prevent multiple subscriptions when leaving the component
      this.userSubscription.unsubscribe();
  }

  onNameInputChange() {
    const name = this.AddUserForm.get('name').value;

    // Make the API request only if the name has at least 3 characters
    if (name.length >= 4) {
      this.userService.getReferralIds(name).subscribe((response) => {
        this.results = response;
      });
    } else {
      // Clear the results if the input length is less than 3 characters
      this.results = [];
    }
  }

  
  selectResult(result: any) {
    // Handle the selected result, for example, populate the 'name' control and store the corresponding ID
    this.AddUserForm.patchValue({
      name: result.idAndName,
      refid: result.idAndName.split('-')[0], // Extract the ID from the result
    });
    this.results = []; // Clear the results after selection
  }

  /**
   * User Form Initialize
   */

  AddUserFormInitialize() {
  this.AddUserForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    sales: ["", [Validators.required]],
    remarks: ["", [Validators.required, Validators.maxLength(100)]],
    fdate: [new Date(), [Validators.required]],
    tdate: [new Date(), [Validators.required]],
    refid: [0], // Add the refid control
  });
}

onSubmit() {
  //  this.submitted = true;

  if (this.AddUserForm.invalid) {
    return;
  }

  const formData = this.AddUserForm.value;
  console.log(formData.fdate)
  
  // Format the date strings before sending them to the server
  const formattedFromDate = this.datePipe.transform(formData.fdate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  const formattedToDate = this.datePipe.transform(formData.tdate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  // Get the current date and time in the desired format
  const modifiedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  // Check if the URL contains 'edit' to differentiate between create and edit actions
  if (this.router.url.indexOf("edit") !== -1) {
    // For editing, form a request body with put method fields
    const requestBody = {
      id: this.userDetails.id,
      refid:formData.name,
      sales: formData.sales,
      remarks: formData.remarks,
      fdate: formattedFromDate,
      tdate: formattedToDate,
      isdeleted: "string",
      createdby: "Admin",
      createdon: modifiedDate, // You might want to update these fields
      modifiedby: "Admin",
      modifiedon: modifiedDate, // Similarly update these fields with appropriate values
    };

    this.userService.updateUser(requestBody)
      .subscribe((response) => {
        // this.backToUserList();
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
        this.router.navigate([ROUTE_PATH.ADMIN, ROUTE_PATH.BESTPERFORMER,ROUTE_PATH.BESTPERFORMERS.LIST,]);
      });
  

  } else {
    // For creating a new announcement
    const requestBody = {
      refid:formData.name,
      sales: formData.sales,
      remarks: formData.remarks,
      fdate: formattedFromDate,
      tdate: formattedToDate,
      isdeleted: "string",
      createdby: "Admin",
      createdon: modifiedDate, // You might want to update these fields
      modifiedby: "string",
      modifiedon: modifiedDate, // Similarly update these fields with appropriate values

    };

    this.userService.CreateAnnouncement(requestBody)
      .subscribe((response) => {
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
        //  this.backToUserList();
          this.router.navigate([ROUTE_PATH.ADMIN, ROUTE_PATH.BESTPERFORMER,ROUTE_PATH.BESTPERFORMERS.LIST,]);
      });
  }
}


  /**
   * Back to User List
   * @param
   * @returns
   */
  backToUserList() {
    this.router.navigate([ROUTE_PATH.ADMIN, ROUTE_PATH.BESTPERFORMER,ROUTE_PATH.BESTPERFORMERS.LIST,]);
  }

}


  // form: FormGroup;
  // results: any[] = [];

  // constructor(private fb: FormBuilder, private apiService: BestperformerService) {
  //   this.form = this.fb.group({
  //     name: [''],
  //   });
  //   // Listen to changes in the 'name' control and make API requests
  //   this.form
  //     .get('name')
  //     .valueChanges.pipe(
  //       debounceTime(300),
  //       switchMap((name) => this.apiService.getReferralIds(name))
  //     )
  //     .subscribe((response) => {
  //       this.results = response;
  //     });
  // }

  // selectResult(result: any) {
  //   // Handle the selected result, for example, send it in another API request
  //   console.log('Selected Result:', result);
  // }

