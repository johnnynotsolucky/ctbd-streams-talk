import * as fs from 'fs'
import xs, { Stream, Listener } from 'xstream'
import { Driver } from '@cycle/run'
import { adapt } from '@cycle/run/lib/adapt'
import { prop, has } from 'ramda'
import { doNothing } from './utils'
import { Prop, Has } from './interfaces'

export interface FSWatch {
  dir: string
}

export interface FSRead {
  filename: string
}

export interface FSWrite extends FSRead {
  data: any
}

export interface FSOperation {
  watch?: FSWatch
  write?: FSWrite
  read?: FSRead
}

export interface FSSource {
  watch: Stream<WatchEvent>
  read: Stream<ReadEvent>
}

export interface WriteEvent {
  filename: string
  success: boolean
}

export interface ReadEvent extends WriteEvent {
  data: string
}

export interface WatchEvent extends WriteEvent {
  event: string
  dir: string
  data: string
}

const hasWatch: Has<FSOperation> = has('watch')
const pickWatch: Prop<FSOperation, FSWatch> = prop('watch')

const watch = (input$: Stream<FSOperation>): Stream<WatchEvent> =>
  input$
  .filter(hasWatch)
  .map(pickWatch)
  .map(({ dir }: FSWatch) => xs.create({
    start: (listener: Listener<WatchEvent>) =>
      fs.watch(dir, (event: string, filename: string) =>
        fs.readFile(`${dir}/${filename}`, (err, data) =>
          listener.next({
            event,
            dir,
            filename,
            data: data.toString(),
            success: !(!!err)
          })
        )
      ),
    stop() { /* */ }
  }))
  .flatten()

const hasWrite: Has<FSOperation> = has('write')
const pickWrite: Prop<FSOperation, FSWrite> = prop('write')

const write = (input$: Stream<FSOperation>): Stream<WriteEvent> =>
  input$
  .filter(hasWrite)
  .map(pickWrite)
  .map(({ filename, data }: FSWrite) => xs.create({
    start: (listener: Listener<WriteEvent>) =>
      fs.writeFile(filename, data, err =>
        listener.next({
          filename,
          success: !(!!err)
        })
      ),
    stop() { /* */ }
  }))
  .flatten()

const hasRead: Has<FSOperation> = has('read')
const pickRead: Prop<FSOperation, FSRead> = prop('read')

const read = (input$: Stream<FSOperation>): Stream<ReadEvent> =>
  input$
  .filter(hasRead)
  .map(pickRead)
  .map(({ filename }: FSRead) => xs.create({
    start: (listener: Listener<ReadEvent>) =>
      fs.readFile(filename, (err, data) =>
        listener.next({
          filename,
          data: data.toString(),
          success: !(!!err)
        })
      ),
    stop() { /* */ }
  }))
  .flatten()

export default (): Driver<Stream<FSOperation>, FSSource> => {

  return function fsDriver(input$: Stream<FSOperation>): FSSource {
    const watch$ = input$.compose(watch)

    const write$ = input$
      .compose(write)
      .subscribe(doNothing)

    const read$ = input$.compose(read)

    read$.subscribe(doNothing)

    return {
      watch: adapt(watch$),
      read: adapt(read$)
    }
  }
}
