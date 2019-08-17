import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RetrospectiveService } from '../services/api/retrospective.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  form: FormGroup;

  private readonly groupValidators = [Validators.required, Validators.maxLength(50), Validators.minLength(5)];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly retrospectiveApi: RetrospectiveService) {
  }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      groupCode:  [null],
      displayName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      createGroup: [true],
      groupName: [null, this.groupValidators]
    });
  }

  private setChangeValidate() {
    this.form.get('createGroup').valueChanges.subscribe((newValue) => {
      if (newValue === true)  {
        this.form.get('groupCode').clearValidators();
        this.form.get('groupName').setValidators(this.groupValidators);
      } else {
        this.form.get('groupName').clearValidators();
        this.form.get('groupCode').setValidators(this.groupValidators);
      }
      this.form.get('groupCode').reset(null);
      this.form.get('groupName').reset(null);
    });
  }

  private goToNotePanel(retrospectiveCode: string, name: string) {
    this.router.navigate(['r/', retrospectiveCode], {state:{ name}});
  }

  onSubmit(formValue: any) {
    if (formValue.createGroup) {
      this.retrospectiveApi.create(formValue.groupName).subscribe( (retrospective) => {
        console.log(retrospective);
        if (retrospective) {
          this.goToNotePanel(retrospective.code, formValue.displayName);
        } else {
          console.log('Error');
        }
      });
    } else {
      this.goToNotePanel(formValue.groupCode, formValue.displayName);
    }
  }
}
