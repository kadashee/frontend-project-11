import './style.css'
import Modal from 'bootstrap/js/dist/modal'
import initI18n from './i18n.js'
import createState from './state.js'
import { initView } from './view.js'
import createController from './controller.js'

const app = (i18n) => {
  const state = createState()
  const elements = {
    form: document.querySelector('#rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('#feeds'),
    posts: document.querySelector('#posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('#modalLabel'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  }
  const modal = new Modal(elements.modal)
  const controller = createController(state, elements)

  initView(state, elements, i18n)

  elements.posts.addEventListener('click', (e) => {
    const target = e.target.closest('[data-id]')

    if (!target) {
      return
    }

    const { id } = target.dataset
    controller.markPostAsRead(id)

    if (target.tagName === 'BUTTON') {
      state.ui.modal.postId = id
      modal.show()
    }
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = formData.get('url').trim()

    controller.submitRss(url)
  })

  controller.startAutoUpdate()
}

initI18n().then(app)
