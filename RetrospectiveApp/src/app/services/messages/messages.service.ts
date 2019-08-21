import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UpdateMessage } from './update-message';
import { EventNames } from './event-names';
import { Observable, Subject } from 'rxjs';
import { JoinMessage } from './join-message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private noteCreatedObservable: Subject<UpdateMessage>;

  constructor(private readonly socket: Socket) {
    this.noteCreatedObservable = new Subject();
    this.setEvents();

   }

   private setEvents() {
    this.socket.on(EventNames.noteCreated, (updateMessage: UpdateMessage) => {
      this.noteCreatedObservable.next(updateMessage);
    });
   }

  public sendNoteCreatedMessage(noteId: string) {
    const msg: UpdateMessage = {noteId};
    this.socket.emit(EventNames.broadcastNoteCreated, msg);
  }

  public join(retrospectiveCode: string, name: string) {
    const msg: JoinMessage = { retrospectiveGroup: retrospectiveCode, name};
    this.socket.emit(EventNames.join, msg);
  }

  public get onNoteCreated(): Subject<UpdateMessage> {
    return this.noteCreatedObservable;
  }
}
