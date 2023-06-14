import * as yup from 'yup';
import { featureValidationSchema } from 'validationSchema/features';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { goalValidationSchema } from 'validationSchema/goals';

export const companyValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  feature: yup.array().of(featureValidationSchema),
  feedback: yup.array().of(feedbackValidationSchema),
  goal: yup.array().of(goalValidationSchema),
});
