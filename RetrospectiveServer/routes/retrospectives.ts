import { Request, Response, Router, NextFunction } from 'express';
import retrospective, { Retrospective } from '../models/retrospective';
import * as shortid from 'shortid';

export class RetrospectivesRoute {
  public static create(): Router {
    const router: Router = Router();
    /* GET the data of the given retrospective id*/
    router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
      const retro = await retrospective.findById(req.params.id);
      if (retro) {
        res.json(retro);
      } else {
        res.json(null);
      }
    });

    /* GET the data of the given retrospective id*/
    router.get('/code/:code', async (req: Request, res: Response, next: NextFunction) => {
      const retro = await retrospective.findOne({code: req.params.code});
      if (retro) {
        res.json(retro);
      } else {
        res.json(null);
      }
    });

    /**
     * POST a new retrospective given a name
     */
    router.post('/:name', async (req: Request, res: Response, next: NextFunction) => {
      const retro = <Retrospective> {};
      retro.name = req.params.name;
      retro.code = shortid.generate();
      const newRetro = await retrospective.create(retro);
      if (newRetro) {
        res.json(newRetro);
      } else {
        res.json(null);
      }
      
    });

    return router;
  }
}
