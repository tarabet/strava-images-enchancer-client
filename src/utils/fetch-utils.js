import {getSession} from "next-auth/client";

export const isProd = process.env.ENV === 'production'
const port = parseInt(process.env.PORT, 10) || 8080

export function apiGet (req, url, language) { // Specify if we are requesting translations
  const { fetchUrl, options } = prepare(req, url, language)

  return fetchWrapper(req, fetchUrl, options)
}

function writeBody (options, body, req) {
  if (!body) {
    return
  }
  if (typeof body === 'string') {
    options.body = body
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else {
    if (typeof body === 'object' && (req || typeof window === 'undefined' || !(body instanceof FormData))) {
      options.body = JSON.stringify(body)
      options.headers['Content-Type'] = 'application/json'
    } else {
      options.body = body
    }
  }
}

export function apiPost (req, url, body) {
  const { fetchUrl, options } = prepare(req, url)

  options.method = 'POST'
  writeBody(options, body, req)

  return fetchWrapper(req, fetchUrl, options)
}

export function apiPut (req, url, body) {
  const { fetchUrl, options } = prepare(req, url)

  options.method = 'PUT'
  writeBody(options, body)

  return fetchWrapper(req, fetchUrl, options)
}

export function apiPatch (req, url, body) {
  const { fetchUrl, options } = prepare(req, url)

  options.method = 'PATCH'
  writeBody(options, body)

  return fetchWrapper(req, fetchUrl, options)
}

export function apiDelete (req, url, body) {
  const { fetchUrl, options } = prepare(req, url)

  options.method = 'DELETE'
  writeBody(options, body)

  return fetchWrapper(req, fetchUrl, options)
}

export function remotePost (remoteUrl, body) {
  const options = {
    method: 'POST',
    headers: { Accept: 'application/json' }
  }

  writeBody(options, body)

  return fetch(remoteUrl, options)
}

function extractCookieKey (cookie, key) {
  const value = '; ' + cookie
  const parts = value.split('; ' + key + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

function copyHeaders (req, options) {
  if (req.headers) {
    if (req.headers.cookie) {
      options.headers.Cookie = req.headers.cookie
    }
    if (req.headers.authorization) {
      options.headers.Authorization = req.headers.authorization
    }
  }
}

export function prepare (req, url) {
  let baseUrl
  let options

  if (req) {
    // server-side call
    baseUrl = isProd ? process.env.BACKEND_URL : ('http://localhost:' + port)
    options = {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    }
    copyHeaders(req, options)
  } else {
    // in-browser call
    baseUrl = 'http://localhost:' + port
    options = {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    }
  }

  // options.headers['Accept-Language'] = language || (req && req.lng) || i18n.language

  const fetchUrl = baseUrl + url

  return { fetchUrl, options }
}

async function fetchWrapper (req, fetchUrl, options) {
  let response
  let error
  let session
  let sessionToken

  const { method } = options
  const xsrfToken = (method === 'PUT' || method === 'POST' || method === 'DELETE') && !req && extractCookieKey(document.cookie, 'XSRF-TOKEN')

  if (typeof window === 'undefined' && req) {
    session = await getSession({ req })
  } else {
    session = await getSession()
  }

  sessionToken = session?.token

  if (xsrfToken) {
    options.headers['X-XSRF-TOKEN'] = xsrfToken
  }

  if (sessionToken) {
    options.headers['Authorization'] = 'Bearer ' + sessionToken
  }

  try {
    response = await fetch(fetchUrl, options)

    if (!response.ok) {
      error = createError(
        'Request failed with status code ' + response.status,
        fetchUrl,
        options,
        response,
        null
      )
    }
  } catch (e) {
    logError(req, 'Failed to fetch response from: ', fetchUrl, ' with options: ', options, ', error: ', e)
    error = createError(
      'Request failed: ' + (e.message || e),
      fetchUrl,
      options,
      null,
      e
    )
  }

  if (!error) {
    try {
      if (response.status === 204) {
        return null
      }

      return await response.json()
    } catch (e) {
      logError(req, 'Failed to parse json response from: ', fetchUrl, ' with options: ', options, ', error: ', e)

      error = createError(
        'Failed to parse response: ' + (e.message || e),
        fetchUrl,
        options,
        response,
        e
      )
    }
  }

  throw error
}

function createError (message, url, options, response, exception) {
  const error = new Error(message)
  error.url = url
  error.options = options
  if (response) {
    error.response = response
  }
  if (exception) {
    error.innerError = exception
  }

  return error
}

function logError (req) {
  if (req) {
    console.log("Error logger", ...Array.prototype.slice.call(arguments, 1))
  }
}
