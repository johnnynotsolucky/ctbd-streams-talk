import xs, { Stream, Listener } from 'xstream'
import { Driver } from '@cycle/run'
import * as IO from 'socket.io'
import {adapt} from '@cycle/run/lib/adapt'
import { doNothing } from './utils'

export interface ConnectEvent {
  name: string
  client?: any
  reason?: string
  error?: any
}

export interface SocketEmit {
  event: string
  args?: any
}

export interface SocketEvent {
  event: string
  client: any
  data: any
}

export interface EventSelector {
  (event: string): Stream<SocketEvent>
}

export interface SocketSource {
  server: Stream<SocketEvent>,
  select: EventSelector
}

export default function makeServerSocketDriver (server: any): Driver<Stream<SocketEmit>, SocketSource> {
  const io = IO(server)

  const serverEvent$ = xs.create({
    start(listener: Listener<ConnectEvent>) {
      const connect = (socket: object): void =>
        listener.next({
          name: 'connect',
          client: socket
        })
      io.on('connection', connect)
      io.on('connect', connect)

      const disconnect = (reason: string): void =>
        listener.next({
          name: 'disconnect',
          reason
        })
      io.on('disconnect', disconnect)
      io.on('disconnecting', disconnect)

      io.on('error', (err: any): void =>
        listener.next({
          name: 'error',
          error: err
        })
      )
    },
    stop() { /* noOp */ }
  })

  const select = (event: string): Stream<SocketEvent> =>
    adapt(serverEvent$
    .filter(({ name }: ConnectEvent) => name === 'connect')
    .map(({ client }: ConnectEvent) => xs.create({
      start: (listener: Listener<SocketEvent>) =>
        client &&
        client.on(event, (data: any): void =>
          listener.next({ event, client, data })),
      stop() { /* noOp */ }
    }))
    .flatten())

  function socketIODriver (input$: Stream<SocketEmit>) {
    input$
    .map(({ event, args }: SocketEmit) => io.emit(event, args))
    .subscribe(doNothing)

    return {
      server: adapt(serverEvent$),
      select
    }
  }

  return socketIODriver
}