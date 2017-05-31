import { Stream } from 'xstream'

export interface Sensors {
  bearing: number
  boatSpeed: number
  windDirection: number
  windSpeed: number
}

export interface EventSelector<T> {
  (event: string): Stream<T>
}

export interface Prop<T1, T2> {
  <T1>(p: T1): T2
}

export interface Has<T1> {
  <T1>(obj: T1): boolean
}
