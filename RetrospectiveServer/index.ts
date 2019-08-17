import { Server } from './server';
import { Application } from 'express';
import * as http from 'http';
import { debug } from 'debug';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SocketServer } from './messages/socket-server';

class Index {

    private readonly DEFAULT_PORT = 3000;
    private readonly MONGODB_URI: string;
    private readonly d = debug('retrospectiveserver:server');

    private readonly port: number;
    private readonly app: Application;
    private server!: http.Server;
    private socketServer: SocketServer;
    constructor() {
        dotenv.config();
        this.MONGODB_URI = process.env.MONGODB_URI || '';
    /**
     * Get port from environment and store in Express.
     */
        this.port = this.normalizePort(process.env.PORT);
        this.app = Server.bootstrap().app;
    }

    /**
    * Normalize a port into a number
    */

    private normalizePort(val?: String): number {
        if (!val) {
            return this.DEFAULT_PORT;
        }
        var port = parseInt(val.valueOf(), 10);

        if (port >= 0) {
            // port number
            return port;
        } else {
            return this.DEFAULT_PORT;
        }
    }

    public createServer() {

        if (this.MONGODB_URI === '') {
            throw new Error('Mongo Url not provided');
        }

        this.app.set('port', this.port);

        /**
         * Create HTTP server.
         */
        this.server = http.createServer(this.app);

        this.socketServer = new SocketServer(this.server);

        /**
         * Listen on provided port, on all network interfaces.
         */

        mongoose.connect(this.MONGODB_URI, {useNewUrlParser: true});

        this.server.listen(this.port);
        this.server.on('error', this.onError);
        this.server.on('listening', () => this.onListening());

        this.socketServer.start();
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    private onError(error: Error) {

        if (error) {
            console.error(error.name);
            console.error(error.message);
            console.error(error.stack);
            throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    private onListening() {
        var addr = this.server.address();
        if (addr) {
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            this.d('Listening on ' + bind);
            console.log('Listening on ' + bind);
        }
    }
}

new Index().createServer();

