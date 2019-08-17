import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  form: FormGroup;

  private readonly groupCodeValidators = [Validators.required, Validators.maxLength(50), Validators.minLength(5)];

  constructor(private readonly formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      groupCode:  [null],
      displayName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      createGroup: [true]
    });
  }

  private setChangeValidate() {
    this.form.get('createGroup').valueChanges.subscribe((newValue) => {
      if (newValue === true)  {
        this.form.get('groupCode').clearValidators();
      } else {
        this.form.get('groupCode').setValidators(this.groupCodeValidators);
      }
      this.form.get('groupCode').reset(null);
    });
  }

  onSubmit(formValue: any) {
    console.log(formValue);
  }

}
