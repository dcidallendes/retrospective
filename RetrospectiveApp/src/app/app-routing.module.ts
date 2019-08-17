import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinRoomComponent } from './join-room/join-room.component';
import { NotesPanelComponent } from './notes-panel/notes-panel.component';


const routes: Routes = [
  { path: '', component: JoinRoomComponent },
  { path: 'r/:id', pathMatch: 'full', component: NotesPanelComponent},
  { path: '**', redirectTo: ''}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
