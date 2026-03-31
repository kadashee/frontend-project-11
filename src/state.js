import { proxy } from 'valtio/vanilla';

const state = proxy({
  form: {
    valid: true,
    error: null,
  },
  feeds: [],
  posts: [],
});

export default state;
