import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      order: [['title', 'DESC']],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollment = await Enrollment.findOne({
      where: { id: req.params.id },
    });

    if (!enrollment) return res.status(400).json({ error: 'Invalid id!' });

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data!' });

    const { title } = req.body;

    const invalidTitle = await Enrollment.findOne({ where: { title } });

    if (invalidTitle)
      return res.status(400).json({ error: 'This plan already exists!' });

    const enrollment = await Enrollment.create(req.body);

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data!' });

    const { title } = req.body;
    const validEnrollmentPlan = await Enrollment.findOne({ where: { title } });

    if (!validEnrollmentPlan)
      res.status(400).json({ error: "This type of enrollment doesn't exist!" });

    const updatedPlan = await validEnrollmentPlan.update(req.body);

    return res.json(updatedPlan);
  }

  async delete(req, res) {
    const deleted = await Enrollment.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(400).json({ error: 'Invalid id!' });

    return res.json({ message: 'Enrollment type deleted!' });
  }
}

export default new EnrollmentController();
