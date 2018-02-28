
const { fetch, URLSearchParams } = window

let defaultToken

const makeUrl = (url, params) => {
  if (!params) return `/api/v1${url}`

  const keys = Object.keys(params)
  const usp = new URLSearchParams()

  keys.forEach(key => usp.append(key, params[key]))

  return `${url}?${usp.toString()}`
}

const fetchWrap = (url, params) => {
  params.headers = params.headers || {}
  if (
    (params.method === 'POST' || params.method) && params.body
  ) {
    params.headers['content-type'] = params.headers['content-type'] || 'application/json'
  }

  return fetch(makeUrl(url), params)
}

const fetchWrapWithToken = (url, params, token) => {
  const fetchParams = Object.assign({}, params)

  fetchParams.credentials = 'include'
  fetchParams.headers = fetchParams.headers || {}
  Object.assign(fetchParams.headers, { 'X-BLACKCAT-TOKEN': token })

  return fetchWrap(url, fetchParams)
}

const apis = {
  // User auth
  auth: {
    join: params => fetchWrap('/join', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
    auth: params => fetchWrap('/auth/token', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
    unauth: (token = defaultToken) => fetchWrapWithToken(
      '/auth/token',
      { method: 'DELETE' },
      token
    )
  },

  // Channels
  Channels: {
    getChannels: (token = defaultToken) => fetchWrapWithToken(
      '/channels',
      { method: 'GET' },
      token
    )
  },

  // Events
  Events: {
    getEvents: (params, token = defaultToken) => fetchWrapWithToken(
      '/events',
      { method: 'GET', body: params },
      token
    ),
    getEvent: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}`,
      { method: 'GET' },
      token
    ),
    getParticipants: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/participants`,
      { method: 'GET' },
      token
    ),
    participateEvent: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/participants`,
      { method: 'POST' },
      token
    ),
    leaveEvent: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/participants`,
      { method: 'DELETE' },
      token
    ),
    getComments: (eid, query, token = defaultToken) => fetchWrapWithToken(
      makeUrl(`/events/${eid}/comments`, query),
      { method: 'GET' },
      token
    ),
    commentEvent: (eid, comment, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/comments`,
      { method: 'POST', body: { comment } },
      token
    ),
    getLikeUsers: (eid, query, token = defaultToken) => fetchWrapWithToken(
      makeUrl(`/events/${eid}/likes`, query),
      { method: 'GET' },
      token
    ),
    likeEvent: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/likes`,
      { method: 'POST' },
      token
    ),
    unlikeEvent: (eid, token = defaultToken) => fetchWrapWithToken(
      `/events/${eid}/likes`,
      { method: 'DELETE' },
      token
    )
  },

  // Users
  Users: {
    getUser: (token = defaultToken) => fetchWrapWithToken(
      '/user',
      { method: 'GET' },
      token
    ),
    getUserEvents: (query, token = defaultToken) => fetchWrapWithToken(
      makeUrl(`/user/events`, query),
      { method: 'GET' },
      token
    )
  }
}

window._pangolier = { apis }

// Test
const test = async () => {
  await apis.auth.join({
    username: 'aaaa',
    password: '123456',
    email: 'test@shopee.com'
  })

  apis.auth.auth({
    username: 'aaaa',
    password: '123456'
  })
}

test()
