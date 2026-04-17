import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
  string: {
    url: 'errors.invalidUrl',
  },
})

const createSchema = (existingUrls) => {
  return yup.string()
    .required()
    .url()
    .notOneOf(existingUrls, 'errors.duplicate')
}

export const validateUrl = (url, existingUrls) => {
  const schema = createSchema(existingUrls)
  return schema.validate(url)
}
