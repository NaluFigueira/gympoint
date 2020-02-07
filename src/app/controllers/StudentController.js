import * as Yup from 'yup';

import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { name } = req.query;
    if (name) {
      const student = await Student.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
      });

      return res.json(student);
    }
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'All fields are required!' });

    const { email } = req.body;

    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists)
      return res
        .status(400)
        .json({ error: 'This student is already registred!' });

    const { id, name, age, weight, height } = await Student.create(req.body);

    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body)))
      return res
        .status(400)
        .json({ error: 'At least one of the fields is incorrect!' });

    const student = await Student.findByPk(req.body.id);

    if (!student) return res.status(400).json({ error: 'Invalid student id!' });

    const { email } = req.body;
    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists)
        return res
          .status(400)
          .json({ error: 'This email is already registred!' });
    }

    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) return res.status(400).json({ error: 'Invalid student id!' });
    await Student.destroy({ where: { id } });
    const students = await Student.findAll();
    return res.json(students);
  }
}

export default new StudentController();
