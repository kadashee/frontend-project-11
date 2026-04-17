import i18next from 'i18next'

const resources = {
  ru: {
    translation: {
      errors: {
        required: 'Не должно быть пустым',
        invalidUrl: 'Ссылка должна быть валидным URL',
        duplicate: 'RSS уже существует',
        network: 'Ошибка сети',
        parse: 'Ресурс не содержит валидный RSS',
      },
      messages: {
        success: 'RSS успешно загружен',
      },
      titles: {
        feeds: 'Фиды',
        posts: 'Посты',
      },
      buttons: {
        view: 'Просмотр',
        close: 'Закрыть',
        readMore: 'Читать полностью',
      },
    },
  },
}

const initI18n = () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => i18next)

export default initI18n
