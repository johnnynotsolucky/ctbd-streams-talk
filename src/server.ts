import xs, { Stream } from 'xstream'
import { run } from '@cycle/run'
import { prop } from 'ramda'
import { createServer, Server } from 'http'
import makeServerSocketDriver, { SocketSource, SocketEvent, SocketEmit } from './server-socket-driver'
import makeFsDriver, { FSSource, WatchEvent, FSOperation } from './fs-driver'
import { Sensors, Prop } from './interfaces'

const dataToFloat = (filename: string, input$: Stream<WatchEvent>): Stream<number> =>
  input$
  .filter(({ filename: evFilename }: WatchEvent) => evFilename === filename)
  .map(({ data }: WatchEvent) => parseFloat(data || ''))
  // .startWith(-1)

const combineSensors = (input$: Stream<WatchEvent>): Stream<Sensors> =>
  xs.combine(
    dataToFloat('bearing', input$),
    dataToFloat('boat-speed', input$),
    dataToFloat('wind-direction', input$),
    dataToFloat('wind-speed', input$)
  )
  .map(([bearing, boatSpeed, windDirection, windSpeed]) => ({
    bearing,
    boatSpeed,
    windDirection,
    windSpeed
  }))

const emitUpdate = (input$: Stream<Sensors>): Stream<SocketEmit> =>
  input$
  .map((sensors: Sensors) => ({
    event: 'message',
    args: sensors
  }))


interface Sources {
  Socket: SocketSource
  Boat: FSSource
}

interface Sinks {
  Socket: Stream<SocketEmit>
  Boat: Stream<FSOperation>
}

const dataProp: Prop<SocketEvent, string> = prop('data')

const notify = (filename: string) => (angle: string): FSOperation =>({
  write: {
    filename,
    data: parseFloat(angle)
  }
})

const main = (sources: Sources): Sinks => {
  const watchInterface$ = xs.of({
    watch: {
      dir: './interface'
    }
  })

  const steer$ = sources.Socket.select('message')
    .map(dataProp)
    .map(notify('./interface/steer'))

  const sensors$ = sources.Boat.watch
    .compose(combineSensors)
    .compose(emitUpdate)

  return {
    Socket: sensors$,
    Boat: xs.merge(watchInterface$, steer$)
  }
}

const httpServer = createServer()

run(main, {
  Socket: makeServerSocketDriver(httpServer),
  Boat: makeFsDriver()
})

httpServer.listen(3000, () => console.log('3000'))
