import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      errors: {
        required: 'Не должно быть пустым',
        invalidUrl: 'Ссылка должна быть валидным URL',
        duplicate: 'RSS уже существует',
      },
    },
  },
};

const initI18n = () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
});

export default initI18n;
