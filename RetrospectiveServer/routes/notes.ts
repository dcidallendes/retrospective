
import { Request, Response, Router, NextFunction } from 'express';
import note from '../models/note';


export class NotesRoute {
    public static create(): Router {
        const router = Router();
        /* GET the data for the given note id*/
        router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
            note.findById(req.params.id).then((foundNote: any) => {
                if (foundNote) {
                    res.json(foundNote);
                } else {
                    res.status(404).json('Note not found');
                }
            }).catch(() => {
                res.status(500).json('Unable to get note');
            });
        });

        /* Create a new note*/
        router.post('/', (req: Request, res: Response) => {
            note.create()
        });

        /* Update an existing note */
        router.put('/:id', (req: Request, res: Response) => {

        });

        return router;
    }
}

