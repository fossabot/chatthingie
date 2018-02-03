import store from '@/store'
import { CONNECTED,
  DISCONNECTED,
  CONNECTING
} from '@/store/modules/chat/constants'

const maxReconnect = 5
const reconnectDelay = 500
var reconnect = 0
var socket = null
var reconnectTimeout = null

export const connect = function (force) {
  disconnect()
  if (force) {
    reconnect = 0
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
  }
  if (reconnect > maxReconnect) {
    store.commit(DISCONNECTED)
    return
  }
  store.commit(CONNECTING)
  reconnect = reconnect + 1
  console.log('connecting')
  const loc = window.location
  var uri = ''
  if (loc.protocol === 'https:') {
    uri = 'wss:'
  } else {
    uri = 'ws:'
  }
  uri += '//' + loc.host
  if (__DEV__) {
    uri += '/api'
  }
  uri += '/chat'
  console.log(uri)
  socket = new WebSocket(uri)

  socket.onopen = function (event) {
    reconnect = 0
    store.commit(CONNECTED)
    console.log(`connected ${event}`)
  }

  socket.onmessage = function (event) {
    console.log(`on message ${event.data}`)
    console.log(event.data)
  }

  socket.onclose = function (event) {
    store.commit(DISCONNECTED)
    console.log(`on close ${event}`)
  }

  socket.onerror = function (event) {
    console.log(`on error ${event}`)
    reconnectTimeout = setTimeout(function () {
      connect()
    }, reconnect * reconnectDelay)
  }
}

export const disconnect = function () {
  if (socket) {
    socket.close()
  }
}

export const send = function (message) {
  socket.send(message)
}