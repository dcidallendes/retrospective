import { Server }  from 'http';
import socketIo from 'socket.io';
import retrospective from '../models/retrospective';
import { JoinMessage } from './join-message';
import { EventNames } from './event-names';

export class SocketServer {
    private io!: SocketIO.Server;
    constructor(private readonly server: Server) {
    }

    private configureListeners() {
        this.io.on('connection', (socket: socketIo.Socket) => {
            socket.on(EventNames.join, async (message: JoinMessage) => {
                const exists = await retrospective.exists( {name: message.retrospectiveGroup});
                if (exists) {
                    socket.join(message.retrospectiveGroup);
                    this.io.sockets.to(message.retrospectiveGroup).emit(EventNames.userJoined, message.name);
                } else {
                    socket.disconnect();
                }
                socket.on(EventNames.broadcastNoteCreated, (noteId) => {
                    this.io.sockets.to(message.retrospectiveGroup).emit(EventNames.noteCreated, noteId);
                });
                socket.on(EventNames.broadcastNoteUpdated, (noteId) => {
                    this.io.sockets.to(message.retrospectiveGroup).emit(EventNames.noteUpdated, noteId);
                });
                socket.on(EventNames.broadcastNoteDeleted, (noteId) => {
                    this.io.sockets.to(message.retrospectiveGroup).emit(EventNames.noteDeleted, noteId);
                });
            });
        });
    }

    public start() {
        this.io = socketIo(this.server);
        this.configureListeners();
    }
}