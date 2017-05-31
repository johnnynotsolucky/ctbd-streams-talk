import xs, { Stream } from 'xstream'
import tween from 'xstream/extra/tween'
import throttle from 'xstream/extra/throttle'
import { run } from '@cycle/run'
import makeFsDriver, { FSSource, FSOperation, FSWrite, WatchEvent, ReadEvent } from './fs-driver'
import { reverseRange, Range } from './utils'

export interface Sources {
  Boat: FSSource
}

export interface Sinks {
  Boat: Stream<FSOperation>
}

export interface SensorConfig extends Range {
  filename?: string
  time: number
}

const createTween = (config: SensorConfig) => (x: number) => {
  const range = reverseRange({ min: config.min, max: config.max })(x)
  return tween({
    from: range[0],
    to: range[1],
    ease: tween.exponential.easeInOut,
    duration: config.time
  })
}

const tweenSensorChange = (config: SensorConfig): Stream<FSOperation> =>
  xs
  .periodic(config.time)
  .map(createTween(config))
  .flatten()
  .compose(throttle(200))
  .map(change => ({
      write: {
        filename: config.filename || '',
        data: change
      }
    })
  )

const pickSteer = (input$: Stream<WatchEvent>) =>
  input$
  .filter(ev => ev.filename === 'steer')
  .map(({ data }) => data)

const pickBearing = (input$: Stream<ReadEvent>) =>
  input$
  .filter(({ filename}) => filename === './interface/bearing')
  .map(({ data }) => data)

interface BearingUpdate {
  steer: string
  bearing: string
}

const tweenBearing = (update: BearingUpdate) => {
  const from = parseFloat(update.bearing || '')
  const to = from + parseFloat(update.steer || '')
  return createTween({ min: from, max: to, time: 2500 })(0)
}

const toBearing = (([steer, bearing]: string[]): BearingUpdate => ({ steer, bearing }))

const main = ({ Boat }: Sources): Sinks => {
  const watchInterface$ = xs.of({
    watch: {
      dir: './interface'
    }
  })

  const bearingOnSteer$ = Boat.watch
    .filter(ev => ev.filename === 'steer')
    .map(() => ({
        read: {
          filename: './interface/bearing'
        }
      })
    )

  const bearingUpdate$ = xs.combine(
      Boat.watch.compose(pickSteer),
      Boat.read.compose(pickBearing)
    )
    .map(toBearing)
    .map(tweenBearing)
    .flatten()
    .map(change => ({
        write: {
          filename: './interface/bearing',
          data: change
        }
      })
    )

  const boatSpeed$ = tweenSensorChange({
    filename: './interface/boat-speed',
    time: 20000,
    min: 10,
    max: 12
  })

  const windDirection$ = tweenSensorChange({
    filename: './interface/wind-direction',
    time: 30000,
    min: 90,
    max: 135
  })

  const windSpeed$ = tweenSensorChange({
    filename: './interface/wind-speed',
    time: 15000,
    min: 16,
    max: 24
  })

  return {
    Boat: xs.merge(
      boatSpeed$,
      windDirection$,
      windSpeed$,
      bearingOnSteer$,
      watchInterface$,
      bearingUpdate$
    )
  }
}

run(main, {
  Boat: makeFsDriver()
})
