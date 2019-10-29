import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreign_key: 'student_id',
      as: 'student',
    });
  }
}

export default Checkin;
