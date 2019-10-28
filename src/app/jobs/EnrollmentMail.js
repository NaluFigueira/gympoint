import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const enrollment = data.createdEnrollment;
    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Matrícula realizada',
      template: 'enrollment',
      context: {
        name: enrollment.student.name,
        start_date: format(parseISO(enrollment.start_date), "dd'/'MM'/'yyyy"),
        plan_title: enrollment.plan.title,
        plan_duration: enrollment.plan.duration,
        price: enrollment.price,
        end_date: format(parseISO(enrollment.end_date), "dd'/'MM'/'yyyy"),
      },
    });
  }
}

export default new EnrollmentMail();
