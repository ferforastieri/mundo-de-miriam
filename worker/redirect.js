const TARGET_HOST = 'www.mundodemiriam.com.br'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = `https://${TARGET_HOST}${url.pathname}${url.search}`

    return Response.redirect(target, 301)
  }
}
