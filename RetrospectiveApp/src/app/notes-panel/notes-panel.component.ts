import { Component, OnInit } from '@angular/core';
import { Note } from '../data/note';
import { ActivatedRoute, Router } from '@angular/router';
import { RetrospectiveService } from '../services/api/retrospective.service';
import { NoteService } from '../services/api/note.service';
import * as _ from 'lodash';
import { NoteTypes } from '../data/note-types.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Retrospective } from '../data/retrospective';
import { MessagesService } from '../services/messages/messages.service';

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
              private readonly formBuilder: FormBuilder,
              private readonly messagesClient: MessagesService) {
              }

  ngOnInit() {
    this.retrospectiveCode = this.activatedRoute.snapshot.params.id;
    this.createForm();
    this.getRetrospectiveAndNotes();
  }

  private initializeMessagesClient() {
    this.messagesClient.join(this.retrospective.code, '');
    this.messagesClient.onNoteCreated.subscribe(async message => {
      const newNote = await this.noteApi.getById(message.noteId).toPromise();
      if (newNote)  {
        this.insertOrReplaceNote(newNote);
      }
    });
  }

  private insertOrReplaceNote(note: Note) {
    const oldNoteIndex = this.notes.findIndex(n => n._id === note._id);
    if (oldNoteIndex >= 0) {
      this.notes[oldNoteIndex] = note;
    } else {
      this.notes.push(note);
    }
  }

  private createForm() {
    this.form = this.formBuilder.group(
      {
        createdNoteContent: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
      }
    );
  }

  private getRetrospectiveAndNotes() {
    this.retrospectiveApi.getByCode(this.retrospectiveCode).subscribe(async (retrospective) => {
      this.retrospective =  retrospective;
      if (retrospective) {
        this.initializeMessagesClient();
        this.notes = await this.noteApi.getByRetrospectiveId(retrospective._id).toPromise();
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

  public async onCreateNoteClick(noteType: NoteTypes) {
    const newNote = {} as Note;
    newNote.content = this.form.get('createdNoteContent').value;
    newNote.retrospective = this.retrospective._id;
    newNote.type = noteType;
    const createdNote = await this.noteApi.create(newNote).toPromise();
    if (createdNote) {
      this.notes.push(createdNote);
      this.clearNewNoteForm();
      this.messagesClient.sendNoteCreatedMessage(createdNote._id);
    }
  }
}
