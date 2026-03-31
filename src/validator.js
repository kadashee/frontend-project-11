import * as yup from 'yup';

const createSchema = (existingUrls) => {
  return yup.string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(existingUrls, 'RSS уже существует');
};

export const validateUrl = (url, existingUrls) => {
  const schema = createSchema(existingUrls);
  return schema.validate(url);
};
