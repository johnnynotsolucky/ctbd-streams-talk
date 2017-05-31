import xs, { Stream, Listener } from 'xstream'
import { Driver } from '@cycle/run'
import * as Socket from 'socket.io-client'
import {adapt} from '@cycle/run/lib/adapt'
import { doNothing } from './utils'
import { EventSelector } from './interfaces'

export interface SocketListen {
  event: string
  data: any
}

export interface SocketEvent {
  socket: object
  data: any
}

export interface SocketSource {
  select: EventSelector<SocketEvent>
}

export interface SocketConfig {
  url: string
  options?: object
}

export interface MakeDefinition {
  (config: SocketConfig): Driver<Stream<SocketListen>, SocketSource>
}

const makeClientSocketDriver: MakeDefinition = (config) => {
  const socket = Socket(config.url, config.options)

  const select = (event: string): Stream<SocketEvent> =>
    adapt(xs.create({
      start: (listener: Listener<SocketEvent>) =>
        socket.on(event, (data: any) =>
          listener.next({ socket, data })),
      stop() {
        socket.off(event)
      }
    }))

  return function socketIODriver (input$: Stream<SocketListen>): SocketSource {
    input$
    .map(({ event, data }) => socket.emit(event, data))
    .subscribe(doNothing)

    return {
      select
    }
  }
}

export default makeClientSocketDriver
