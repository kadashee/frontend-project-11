import './style.css';
import initI18n from './i18n.js';
import state from './state.js';
import { validateUrl } from './validator.js';
import { initView } from './view.js';

const app = (i18n) => {
  const elements = {
    form: document.querySelector('#rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  initView(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const existingUrls = state.feeds.map((feed) => feed.url);

    validateUrl(url, existingUrls)
      .then((validUrl) => {
        state.form.valid = true;
        state.form.error = null;

        state.feeds.push({ url: validUrl });

        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        state.form.valid = false;
        state.form.error = error.message;
      });
  });
};

initI18n().then(app);
