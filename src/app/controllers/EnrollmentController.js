import * as Yup from 'yup';
import { isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollment = await Enrollment.findOne({
      include: [
        {
          model: Student,
          as: 'student',
          where: { name: req.params.name },
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data' });

    const { student_id } = req.params;
    const { plan_id, start_date } = req.body;

    const validStudent = await Student.findOne({ where: { id: student_id } });

    if (!validStudent)
      return res.status(401).json({ error: "This student doesn't exist!" });

    const enrolledStudent = await Enrollment.findOne({ where: { student_id } });

    if (enrolledStudent)
      return res
        .status(401)
        .json({ error: 'This student is already enrolled!' });

    const plan = await Plan.findOne({ where: { id: plan_id } });

    if (!plan)
      return res.status(400).json({ error: "This plan doesn't exist!" });

    const formattedDate = parseISO(start_date);

    if (isBefore(formattedDate, new Date()))
      return res.status(400).json({ error: 'Invalid start date!' });

    const end_date = addMonths(formattedDate, plan.duration);
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data' });

    const { plan_id, start_date } = req.body;
    const { enrollment_id } = req.params;

    const plan = await Plan.findOne({ where: { id: plan_id } });

    if (!plan)
      return res.status(400).json({ error: "This plan doesn't exist!" });

    const formattedDate = parseISO(start_date);

    if (isBefore(formattedDate, new Date()))
      return res.status(400).json({ error: 'Invalid start date!' });

    const end_date = addMonths(formattedDate, plan.duration);
    const price = plan.duration * plan.price;
    const enrollment = await Enrollment.findOne({
      where: { id: enrollment_id },
    });

    if (!enrollment) {
      return res.json({ error: "This enrollment doesn't exist" });
    }

    return res.json(
      await enrollment.update({
        plan_id,
        start_date,
        end_date,
        price,
      })
    );
  }

  async delete(req, res) {
    const { enrollment_id } = req.params;
    const enrollment = await Enrollment.findOne({
      where: { id: enrollment_id },
    });
    if (!enrollment) return res.status(400).json({ error: 'Invalid id!' });
    await Enrollment.destroy({ where: { id: enrollment_id } });
    return res.json({ message: 'Enrollment sucessfully removed!' });
  }
}

export default new EnrollmentController();
