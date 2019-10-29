import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/students/:student_id/checkins', CheckinController.show);
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);

routes.use(authMiddleware);
routes.get('/students/help-orders', HelpOrderController.index);
routes.post(
  '/students/help-orders/:helpOrder_id/answer',
  AnswerController.store
);
routes.get('/students/:student_id/help-orders', HelpOrderController.show);
routes.get('/students', StudentController.index);
routes.get('/students/:name', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.delete('/students/:student_id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);
routes.put('/plans', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:name', EnrollmentController.show);
routes.post('/enrollments/:student_id', EnrollmentController.store);
routes.put('/enrollments/:enrollment_id', EnrollmentController.update);
routes.delete('/enrollments/:enrollment_id', EnrollmentController.delete);
export default routes;
