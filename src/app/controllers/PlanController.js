import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async show(req, res) {
    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });

    if (!Plan) return res.status(400).json({ error: 'Invalid id!' });

    return res.json(plan);
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

    const invalidTitle = await Plan.findOne({ where: { title } });

    if (invalidTitle)
      return res.status(400).json({ error: 'This plan already exists!' });

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data!' });

    const plan = await Plan.findByPk(req.body.id);

    if (!plan)
      return res.status(400).json({ error: "This plan doesn't exist!" });

    const { title } = req.body;
    if (title && title !== plan.title) {
      const invalidPlan = await Plan.findOne({ where: { title } });
      if (invalidPlan)
        return res
          .status(400)
          .json({ error: 'This plan is already registred!' });
    }

    await plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const deleted = await Plan.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(400).json({ error: 'Invalid id!' });

    return res.json({ message: 'Plan deleted!' });
  }
}

export default new PlanController();
