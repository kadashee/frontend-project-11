import './style.css';
import Modal from 'bootstrap/js/dist/modal';
import initI18n from './i18n.js';
import createState from './state.js';
import { validateUrl } from './validator.js';
import { initView } from './view.js';
import loadRss from './rssClient.js';
import parseRss from './parser.js';

const normalizeError = (error) => {
  if (error.message?.startsWith('errors.')) {
    return error.message;
  }

  return 'errors.network';
};

const app = (i18n) => {
  const state = createState();
  let idCounter = 1;
  const createId = () => String(idCounter++);

  const updateFeeds = () => {
    const promises = state.feeds.map((feed) => loadRss(feed.url)
      .then((rssContent) => {
        const parsedRss = parseRss(rssContent);
        const existingLinks = state.posts.map((post) => post.link);
        const newPosts = parsedRss.posts
          .filter((post) => !existingLinks.includes(post.link))
          .map((post) => ({
            id: createId(),
            feedId: feed.id,
            ...post,
          }));

        if (newPosts.length > 0) {
          state.posts.unshift(...newPosts);
        }
      })
      .catch(() => {}));

    Promise.all(promises).finally(() => {
      setTimeout(updateFeeds, 5000);
    });
  };

  const markPostAsRead = (postId) => {
    if (!state.ui.readPosts.includes(postId)) {
      state.ui.readPosts.push(postId);
    }
  };

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
  };
  const modal = new Modal(elements.modal);

  initView(state, elements, i18n);

  elements.posts.addEventListener('click', (e) => {
    const target = e.target.closest('[data-id]');

    if (!target) {
      return;
    }

    const { id } = target.dataset;
    markPostAsRead(id);

    if (target.tagName === 'BUTTON') {
      state.ui.modal.postId = id;
      modal.show();
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const existingUrls = state.feeds.map((feed) => feed.url);

    state.form.processState = 'loading';

    validateUrl(url, existingUrls)
      .then(() => loadRss(url))
      .then((rssContent) => {
        const parsedRss = parseRss(rssContent);
        const feedId = createId();
        const feed = {
          id: feedId,
          url,
          ...parsedRss.feed,
        };
        const posts = parsedRss.posts.map((post) => ({
          id: createId(),
          feedId,
          ...post,
        }));

        state.feeds.unshift(feed);
        state.posts.unshift(...posts);
        state.form.valid = true;
        state.form.error = null;
        state.form.processState = 'success';

        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        state.form.valid = false;
        state.form.error = normalizeError(error);
        state.form.processState = 'failed';
      });
  });

  setTimeout(updateFeeds, 5000);
};

initI18n().then(app);
