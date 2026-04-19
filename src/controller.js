import { validateUrl } from './validator.js'
import loadRss from './rssClient.js'
import parseRss from './parser.js'

const normalizeError = (error) => {
  if (error.message?.startsWith('errors.')) {
    return error.message
  }

  return 'errors.network'
}

const createController = (state, elements) => {
  let idCounter = 1

  const createId = () => String(idCounter++)

  const markPostAsRead = (postId) => {
    if (!state.ui.readPosts.includes(postId)) {
      state.ui.readPosts.push(postId)
    }
  }

  const submitRss = (url) => {
    const existingUrls = state.feeds.map(feed => feed.url)

    state.form.processState = 'loading'

    return validateUrl(url, existingUrls)
      .then(() => loadRss(url))
      .then((rssContent) => {
        const parsedRss = parseRss(rssContent)
        const feedId = createId()
        const feed = {
          id: feedId,
          url,
          ...parsedRss.feed,
        }
        const posts = parsedRss.posts.map(post => ({
          id: createId(),
          feedId,
          ...post,
        }))

        state.feeds.unshift(feed)
        state.posts.unshift(...posts)
        state.form.valid = true
        state.form.error = null
        state.form.processState = 'success'

        elements.form.reset()
        elements.input.focus()
      })
      .catch((error) => {
        state.form.valid = false
        state.form.error = normalizeError(error)
        state.form.processState = 'failed'
      })
  }

  const updateFeeds = () => {
    const requests = state.feeds.map(feed => loadRss(feed.url)
      .then((rssContent) => {
        const parsedRss = parseRss(rssContent)
        const existingLinks = state.posts.map(post => post.link)
        const newPosts = parsedRss.posts
          .filter(post => !existingLinks.includes(post.link))
          .map(post => ({
            id: createId(),
            feedId: feed.id,
            ...post,
          }))

        if (newPosts.length > 0) {
          state.posts.unshift(...newPosts)
        }
      })
      .catch(() => {}))

    Promise.all(requests).finally(() => {
      setTimeout(updateFeeds, 5000)
    })
  }

  const startAutoUpdate = () => {
    setTimeout(updateFeeds, 5000)
  }

  return {
    markPostAsRead,
    submitRss,
    startAutoUpdate,
  }
}

export default createController
