import { proxy } from 'valtio/vanilla';

const createState = () => proxy({
  form: {
    valid: true,
    error: null,
    processState: 'idle',
  },
  feeds: [],
  posts: [],
  ui: {
    readPosts: [],
    modal: {
      postId: null,
    },
  },
});

export default createState;
