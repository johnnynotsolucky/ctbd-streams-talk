import xs, { Stream } from 'xstream'
import { run } from '@cycle/run'
import { makeDOMDriver, DOMSource, VNode } from '@cycle/dom'
import { div, ul, li, img, svg, h, button } from '@cycle/dom'
import { prop } from 'ramda'
import makeClientSocketDriver, { SocketEvent, SocketSource, SocketListen } from './client-socket-driver'
import { Sensors, Prop } from './interfaces'
import './main.styl'

const compass = require("url-loader!./compass.svg")
const needleBearing = require("url-loader!./needle-bearing.svg")
const needleWind = require("url-loader!./needle-wind.svg")

const SENSOR_DEFAULTS = {
  bearing: -1,
  windDirection: -1,
  boatSpeed: -1,
  windSpeed: -1
}

interface Sources {
  DOM: DOMSource
  Socket: SocketSource
}

interface Sinks {
  DOM: Stream<VNode>
  Socket: Stream<SocketListen>
}

const dataProp: Prop<SocketEvent, Sensors> = prop('data')

const toFixed = (digits: number) => (x: number) => x.toFixed(digits)

const pickSensors = (input$: Stream<SocketEvent>): Stream<Sensors> =>
  input$
  .map(dataProp)
  .startWith(SENSOR_DEFAULTS)

const steerBoat = (input$: Stream<number>): Stream<SocketListen> =>
  input$
  .map(angle => ({
      event: 'message',
      data: angle
    })
  )

const main = (sources: Sources): Sinks => {
  const steer$ = xs.merge(
    sources.DOM.select('.port').events('click').mapTo(45),
    sources.DOM.select('.starboard').events('click').mapTo(-45)
  )
  .compose(steerBoat)

  const message$ = sources.Socket.select('message').compose(pickSensors)

  const vdom$ = message$
    .map(({ bearing, windDirection, boatSpeed, windSpeed }) =>
      div('.container', [
        div('.controls', [
          button('.port', 'Port'),
          button('.starboard', 'Starboard'),
        ]),
        div('.instrumentation', [
          img('.compass-element.compass', {
            props: { src: compass },
            style: { transform: `rotate(${bearing}deg)` }
          }),
          img('.compass-element.bearing', { props: { src: needleBearing } }),
          img('.compass-element.wind-direction', {
            props: { src: needleWind },
            style: { transform: `rotate(${windDirection}deg)` }
          }),
          svg('.compass-element.boat-speed', {
            attrs: {
              viewBox: '54.985 146.65 458.458 455.434',
            }
          }, [
            h('text', {
              attrs: {
                transform: 'matrix(1.0829 0 0 1 171.8206 436.4399)'
              }
            }, boatSpeed.toFixed(1))
          ]),
          svg('.compass-element.wind-speed', {
            attrs: {
              viewBox: '54.985 146.65 458.458 455.434',
            }
          }, [
            h('text', {
              attrs: {
                transform: 'matrix(1.0829 0 0 1 327.3729 436.4399)'
              }
            }, windSpeed.toFixed(1))
          ])
        ])
      ])
    )

  return {
    DOM: vdom$,
    Socket: steer$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  Socket: makeClientSocketDriver({ url: 'http://localhost:3000' })
})
