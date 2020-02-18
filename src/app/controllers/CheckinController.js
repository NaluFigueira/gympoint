import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async show(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id: id },
      order: [['createdAt', 'DESC']],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;
    const today = Number(new Date());
    const startDate = Number(subDays(today, 7));
    const lastCheckins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: { [Op.between]: [startOfDay(startDate), endOfDay(today)] },
      },
    });

    if (lastCheckins && lastCheckins.length >= 5)
      return res
        .status(401)
        .json('You can only check-in 5 times every 7 days!');

    const checkin = await Checkin.create({ student_id: id });

    return res.json(checkin);
  }
}

export default new CheckinController();
