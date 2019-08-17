import { Request, Response, Router, NextFunction } from 'express';


export class IndexRoute {
  public static create(): Router {
    const router = Router();
    /* GET home page. */
    router.get('/', (req: Request, res: Response, next: NextFunction) =>  {
      res.json('Index Works!');
    });
    return router;
  }
}


