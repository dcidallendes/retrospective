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
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { MatSnackBar } from '@angular/material';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-notes-panel',
  templateUrl: './notes-panel.component.html',
  styleUrls: ['./notes-panel.component.scss']
})
export class NotesPanelComponent implements OnInit {


  private readonly noteTypeHeaders: Map<NoteTypes, string> = new Map<NoteTypes, string>([
    [NoteTypes.like, 'What did you like?'],
    [NoteTypes.lack, 'What was lacking?'],
    [NoteTypes.learn, 'What did you learn?'],
    [NoteTypes.longFor, 'What do you long for going forward?']
  ]);
  public readonly noteTypes = [NoteTypes.like, NoteTypes.lack, NoteTypes.learn, NoteTypes.longFor];

  private retrospectiveCode: string;

  retrospective: Retrospective;

  notes: Note[] = [];
  currentCreationNoteType?: NoteTypes = null;
  createdNoteContent: string;
  form: FormGroup;
  user: SocialUser;
  firstSignIn = true;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly retrospectiveApi: RetrospectiveService,
    private readonly noteApi: NoteService,
    private readonly formBuilder: FormBuilder,
    private readonly messagesClient: MessagesService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly excelService: ExcelService) {
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  async ngOnInit() {
    this.retrospectiveCode = this.activatedRoute.snapshot.params.id;
    this.createForm();
    this.verifyLogin();
  }

  private verifyLogin() {
    this.authService.authState.subscribe(async socialUser => {
      this.user = socialUser;
      if ((!socialUser || !socialUser.email) && this.firstSignIn) {
        this.firstSignIn = false;
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.snackBar.open('Please login using a Google account. Verify if the login popup is blocked by your browser');
        try {
          this.user = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        } catch {
          this.snackBar.open('You need to log in order to post and view retrospective notes');
        }
      }
      if (this.isLoggedIn) {
        this.getRetrospectiveAndNotes();
      } else {
        this.goToMainPage();
      }
    });
  }

  private initializeMessagesClient() {
    this.messagesClient.join(this.retrospective.code, this.user.email);
    this.messagesClient.onNoteCreated.subscribe(async message => this.getNoteAndInsert(message.noteId));
    this.messagesClient.onNoteUpdated.subscribe(async message => this.getNoteAndInsert(message.noteId));
  }

  private async getNoteAndInsert(noteId: any) {
    const newNote = await this.noteApi.getById(noteId).toPromise();
    if (newNote) {
      this.insertOrReplaceNote(newNote);
    }
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
      this.retrospective = retrospective;
      if (retrospective) {
        this.initializeMessagesClient();
        this.notes = await this.noteApi.getByRetrospectiveId(retrospective._id).toPromise();
      } else {
        this.goToMainPage();
      }
    });
  }

  private clearNewNoteForm() {
    this.currentCreationNoteType = null;
    this.form.reset();
  }

  private goToMainPage() {
    this.router.navigate(['']);
  }

  public getNotesByType(noteType: NoteTypes): Note[] {
    const notes = _(this.notes).filter({ type: noteType }).orderBy(['votes.length', 'content'], ['desc', 'asc']).value();
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

  public canVote(note: Note): boolean {
    if (note.votes && note.votes.length > 0) {
      return !note.votes.includes(this.user.id);
    } else {
      return true;
    }
  }

  public async onCreateNoteClick(noteType: NoteTypes) {
    const newNote = {} as Note;
    newNote.content = this.form.get('createdNoteContent').value;
    newNote.retrospective = this.retrospective._id;
    newNote.type = noteType;
    newNote.userId = this.user.id;
    const createdNote = await this.noteApi.create(newNote).toPromise();
    if (createdNote) {
      this.notes.push(createdNote);
      this.clearNewNoteForm();
      this.messagesClient.sendNoteCreatedMessage(createdNote._id);
    }
  }

  public async onAddVoteClick(note: Note) {
    const updatedNote = await this.noteApi.addVote(note._id, this.user.id).toPromise();
    if (updatedNote) {
      this.messagesClient.sendNoteUpdatedMessage(updatedNote._id);
    }
  }

  public onExportToExcelClick() {
    const data = [];
    const sortedNotes: Note[] = _.orderBy(this.notes, ['type', 'votes.length', 'content'], ['asc', 'desc', 'asc']);
    sortedNotes.forEach(n => data.push(
      { type: this.noteTypeHeaders.get(n.type), note: n.content, votes: n.votes.length }));
    this.excelService.exportAsExcelFile(data, this.retrospective.name);
  }
}
