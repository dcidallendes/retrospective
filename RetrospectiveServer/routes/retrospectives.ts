import { Request, Response, Router, NextFunction } from 'express';


export class RetrospectivesRoute {
  public static create(): Router {
    const router: Router = Router();
    /* GET the data of the given retrospective id*/
    router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
      res.send('respond with a resource');
    });

    /* GET all the notes for the given retrospective id*/
    router.get('/:id/notes', (req: Request, res: Response, next: NextFunction) =>{
      res.send('respond with a resource');
    });
    return router;
  }
}
