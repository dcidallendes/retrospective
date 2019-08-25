import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Router } from "express";
import logger from "morgan";
import * as path from "path";
import { IndexRoute } from "./routes";
import { RetrospectivesRoute } from "./routes/retrospectives";
import { NotesRoute } from "./routes/notes";
import cors from 'cors';
import 'reflect-metadata';
import * as swagger from "swagger-express-ts";

/**
 * The express server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  private config() {
    this.app.use(logger('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    console.log(path.join(__dirname, '../public/dist/RetrospectiveApp'));
    this.app.use(express.static(path.join(__dirname, '../public/dist/RetrospectiveApp')));
    this.configSwagger()
  }


  private configSwagger() {
    this.app.use('/api-docs/swagger', express.static('swagger'));
    this.app.use('/api-docs/swagger/assets', express.static( 'node_modules/swagger-ui-dist'));
    this.app.use(bodyParser.json());
    this.app.use(swagger.express(
        {
            definition : {
                info : {
                    title : "Retrospective API that supports Retrospective App" ,
                    version : "1.0"
                }
                // Models can be defined here
            }
        }
    ) );
  }

  /**
   * Create router
   *
   * @class Server
   * @method routes
   */
  private routes() {
    const router = Router();
    router.use('/', IndexRoute.create());
    router.use('/retrospectives', RetrospectivesRoute.create());
    router.use('/notes', NotesRoute.create());
    this.app.use('/api/v1', router);
  }
}