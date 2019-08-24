
import { Request, Response, Router, NextFunction } from 'express';
import note, { Note } from '../models/note';


export class NotesRoute {
    public static create(): Router {
        const router = Router();
        /* GET the data for the given note id*/
        router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const foundNote = await note.findById(req.params.id);
            if (foundNote) {
                res.json(foundNote);
            } else {
                res.sendStatus(404);
            }
        });

        /* Create a new note*/
        router.post('/', async (req: Request, res: Response) => {
            if(!req.body) {
                res.sendStatus(403);
            }
            const newNote: Note = req.body; 
            const createdNote = await note.create(newNote);
            if(createdNote) {
                res.json(createdNote);
            } else {
                res.sendStatus(403);
            }
        });

        /* Update an existing note */
        router.put('/:id', async (req: Request, res: Response) => {
            if(!req.body) {
                res.sendStatus(403);
            }
            const newNote: Note = req.body; 
            const updatedNote = await note.updateOne({_id: req.params.id}, newNote);
            if(updatedNote) {
                res.json(updatedNote);
            } else {
                res.sendStatus(403);
            }
        });

        /* GET notes by retrospective id */
        router.get('/retrospective/:id', async (req: Request, res: Response) => {
            const notes = await note.find({retrospective: req.params.id});
            if(notes) {
                res.json(notes);
            } else {
                res.sendStatus(404);
            }
        });

        /* POST a vote for a given note and user */
        router.post('/:id/vote/:userId', async (req: Request, res: Response) => {
            const notes = await note.findByIdAndUpdate(req.params.id, { '$addToSet': { 'votes': req.params.userId } });
            if(notes) {
                res.json(notes);
            } else {
                res.json(null);
            }
        });

        return router;
    }
}

