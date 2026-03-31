import { watch } from 'valtio/vanilla/utils';

const renderValidationState = (formState, elements, i18n) => {
  const { input, feedback } = elements;

  if (formState.valid) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.classList.remove('d-block');
  } else {
    input.classList.add('is-invalid');
    feedback.textContent = i18n.t(formState.error);
    feedback.classList.add('d-block');
  }
};

export const initView = (state, elements, i18n) => {
  watch((get) => {
    const formState = get(state.form);
    renderValidationState(formState, elements, i18n);
  });
};
