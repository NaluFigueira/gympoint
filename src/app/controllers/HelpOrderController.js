import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params)))
      return res.status(400).json({ error: 'Invalid id!' });

    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);

    if (!student) return res.status(400).json("This student doesn't exist");

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      order: [['createdAt', 'DESC']],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data!' });

    const { id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(id);

    if (!student) return res.status(400).json("This student doesn't exist");

    const helpOrder = await HelpOrder.create({ student_id: id, question });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
