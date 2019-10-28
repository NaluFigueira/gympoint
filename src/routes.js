import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import EnrollmentController from './app/controllers/EnrollmentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:id', EnrollmentController.show);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);
export default routes;
