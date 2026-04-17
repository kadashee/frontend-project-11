import { watch } from 'valtio/vanilla/utils';

const renderValidationState = (formState, elements, i18n) => {
  const {
    input,
    feedback,
    submit,
  } = elements;

  const isLoading = formState.processState === 'loading';

  input.readOnly = isLoading;
  submit.disabled = isLoading;

  if (formState.processState === 'success') {
    input.classList.remove('is-invalid');
    feedback.textContent = i18n.t('messages.success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    return;
  }

  if (formState.processState === 'failed') {
    input.classList.add('is-invalid');
    feedback.textContent = i18n.t(formState.error);
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    return;
  }

  input.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');
};

const renderFeeds = (feeds, container, i18n) => {
  if (feeds.length === 0) {
    container.innerHTML = '';
    return;
  }

  const items = feeds.map((feed) => `
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('titles.feeds')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${items}
      </ul>
    </div>
  `;
};

const renderPosts = (posts, readPosts, container, i18n) => {
  if (posts.length === 0) {
    container.innerHTML = '';
    return;
  }

  const items = posts.map((post) => `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a
        class="${readPosts.includes(post.id) ? 'fw-normal link-secondary' : 'fw-bold'}"
        href="${post.link}"
        target="_blank"
        rel="noopener noreferrer"
        data-id="${post.id}"
      >${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}">${i18n.t('buttons.view')}</button>
    </li>
  `).join('');

  container.innerHTML = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('titles.posts')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${items}
      </ul>
    </div>
  `;
};

const renderModal = (posts, postId, elements, i18n) => {
  const post = posts.find((item) => item.id === postId);

  if (!post) {
    elements.modalTitle.textContent = '';
    elements.modalBody.textContent = '';
    elements.modalLink.removeAttribute('href');
    return;
  }

  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalLink.href = post.link;
  elements.modalLink.textContent = i18n.t('buttons.readMore');
};

export const initView = (state, elements, i18n) => {
  watch((get) => {
    const ui = get(state.ui);

    renderValidationState(get(state.form), elements, i18n);
    renderFeeds(get(state.feeds), elements.feeds, i18n);
    renderPosts(get(state.posts), ui.readPosts, elements.posts, i18n);
    renderModal(get(state.posts), ui.modal.postId, elements, i18n);
  });
};
