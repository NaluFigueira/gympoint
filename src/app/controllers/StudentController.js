import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async show(req, res) {
    const student = await Student.findOne({
      where: { name: req.params.name },
    });

    return res.json(student);
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

    const { email } = req.body;
    const student = await Student.findOne({ where: { email } });

    if (!student)
      return res.status(400).json({ error: "This student doesn't exist" });

    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({ id, name, email, age, weight, height });
  }

  async delete(req, res) {
    const { student_id } = req.params;
    const student = await Student.findOne({ where: { id: student_id } });
    if (!student) return res.status(400).json({ error: 'Invalid id!' });
    await Student.destroy({ where: { id: student_id } });
    return res.json({ message: 'Student successfully removed!' });
  }
}

export default new StudentController();
