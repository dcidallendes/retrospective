import { Component, OnInit } from '@angular/core';
import { Note } from '../data/note';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrospectiveService } from '../services/api/retrospective.service';
import { NoteService } from '../services/api/note.service';
import * as _ from 'lodash';
import { NoteTypes } from '../data/note-types.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Retrospective } from '../data/retrospective';

@Component({
  selector: 'app-notes-panel',
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.scss']
})
export class NotesPanelComponent implements OnInit {


  private readonly noteTypeHeaders: Map<NoteTypes, string> = new Map<NoteTypes, string> ( [
    [NoteTypes.like, 'What did you like?'],
    [NoteTypes.lack, 'What was lacking?'],
    [NoteTypes.learn, 'What did you learn?'],
    [NoteTypes.longFor, 'What do you long for going forward?']
  ]);
  public readonly noteTypes = [NoteTypes.like, NoteTypes.lack, NoteTypes.learn, NoteTypes.longFor];

  private retrospectiveCode: string;
  private retrospective: Retrospective;

  notes: Note[] = [];
  currentCreationNoteType?: NoteTypes = null;
  createdNoteContent: string;
  form: FormGroup;

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly retrospectiveApi: RetrospectiveService,
              private readonly noteApi: NoteService,
              private readonly formBuilder: FormBuilder) {
              }

  ngOnInit() {
    this.retrospectiveCode = this.activatedRoute.snapshot.params.id;
    this.createForm();
    this.getRetrospectiveAndNotes();
  }

  private createForm() {
    this.form = this.formBuilder.group(
      {
        createdNoteContent: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
      }
    );
  }

  private getRetrospectiveAndNotes() {
    this.retrospectiveApi.getByCode(this.retrospectiveCode).subscribe( (retrospective) => {
      this.retrospective =  retrospective;
      if (retrospective) {
        this.noteApi.getByRetrospectiveId(retrospective._id).subscribe(notes => {
          this.notes = notes;
        });
      } else {
        this.router.navigate(['']);
      }
    });
  }

  private clearNewNoteForm() {
    this.currentCreationNoteType = null;
    this.form.reset();
  }

  public getNotesByType(noteType: NoteTypes): Note[] {
    const notes = _.filter(this.notes, {type: noteType});
    console.log(this.notes, notes);
    return notes;
  }

  public getNoteTypeHeader(noteType: NoteTypes): string {
    return this.noteTypeHeaders.get(noteType);
  }

  public onShowCreateNoteClick(noteType: NoteTypes) {
    this.currentCreationNoteType = noteType;
  }

  public onHideCreateNoteClick() {
    this.clearNewNoteForm();
  }

  public onCreateNoteClick(noteType: NoteTypes) {
    const newNote = {} as Note;
    newNote.content = this.form.get('createdNoteContent').value;
    newNote.retrospective = this.retrospective._id;
    newNote.type = noteType;
    this.noteApi.create(newNote).subscribe(createdNote => {
      if (createdNote) {
        this.notes.push(createdNote);
        this.clearNewNoteForm();
      }
    });
  }

}
