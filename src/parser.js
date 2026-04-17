const getRequiredText = (element, selector) => {
  const target = element.querySelector(selector)

  if (!target) {
    throw new Error('errors.parse')
  }

  return target.textContent.trim()
}

const getOptionalText = (element, selector) => {
  const target = element.querySelector(selector)
  return target ? target.textContent.trim() : ''
}

const parseRss = (content) => {
  const parser = new DOMParser()
  const document = parser.parseFromString(content, 'application/xml')

  if (document.querySelector('parsererror')) {
    throw new Error('errors.parse')
  }

  const channel = document.querySelector('channel')

  if (!channel) {
    throw new Error('errors.parse')
  }

  const feed = {
    title: getRequiredText(channel, 'title'),
    description: getOptionalText(channel, 'description'),
  }

  const posts = Array
    .from(channel.querySelectorAll('item'))
    .map(item => ({
      title: getOptionalText(item, 'title'),
      description: getOptionalText(item, 'description'),
      link: getOptionalText(item, 'link'),
    }))

  return { feed, posts }
}

export default parseRss
