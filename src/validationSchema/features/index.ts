import * as yup from 'yup';

export const featureValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  status: yup.string().required(),
  company_id: yup.string().nullable().required(),
  assignee_id: yup.string().nullable(),
});
