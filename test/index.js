var tape = require('tape')
var pull = require('pull-stream')
var reference = require('../')
var reifier = require('pull-stream-protocol-reifier')
var log = require('debug')('pull-stream-reference-modules')

function monitor (t, expected, uoPort, diPort, end) {
  if (arguments.length < 5) end = true

  var probe = reifier(Infinity, uoPort, diPort)
  var i = 0
  pull(
    probe.events,
    pull.drain(
      function (e) {
        log(e)
        t.deepEqual(e, expected[i++])
        if (end && i === expected.length) t.end()
        else if (i > expected.length) t.fail('Received more events than expected')
      },
      function (err) {
        if (err) t.fail(err)
      }
    )
  )
  return probe
}

tape('Source: source(0, true, true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    pull.drain()
  )
})

tape('Source: source(0, new Error(), true)', function (t) {
  pull(
    reference.source(0, new Error('Source Error'), true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'error', 'i': 1, 'err': 'Source Error'}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(1, true, true)', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(1,new Error(),true)', function (t) {
  pull(
    reference.source(1, new Error('Source Error'), true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'error', 'i': 2, 'err': 'Source Error'}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(2, true, true)', function (t) {
  pull(
    reference.source(2, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 2, 'v': 2},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 3, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 3}
    ]),
    pull.drain()
  )
})

tape('source(0, true, true) sink(2,2,true,true,true,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, true, true)
  )
})

tape('source(0, true, true) sink(2,2,true,true,true,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, true, false)
  )
})

tape('source(0,true,true) sink(2,2,true,true,false,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, true)
  )
})

tape('source(0,true,true) sink(2,2,true,true,false,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, false, false)
  )
})

tape('source(0,true,true) sink(2,2,true,false,true,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, true, true)
  )
})

tape('source(0,true,true) sink(2,2,true,false,true,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, true, false)
  )
})

tape('source(0,true,true) sink(2,2,true,false,false,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, false, true)
  )
})

tape('source(0,true,true) sink(2,2,true,false,false,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, false)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),true,true,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, true, true)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),true,true,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, true, false)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),true,false,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, false, true)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),true,false,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, false, false)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),false,true,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': false}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, true, true)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),false,true,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, true, false)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),false,false,true)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': false}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, false, true)
  )
})

tape('source(0,true,true) sink(2,2,new Error(),false,false,false)', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, false, false)
  )
})

tape('source(0, true, false) sink(2,2,true,true,true,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, true, true)
  )
})

tape('source(0, true, false) sink(2,2,true,true,true,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, true, false)
  )
})

tape('source(0, true, false) sink(2,2,true,true,false,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, true)
  )
})

tape('source(0, true, false) sink(2,2,true,true,false,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, false)
  )
})

tape('source(0, true, false) sink(2,2,true,false,true,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, true, true)
  )
})

tape('source(0, true, false) sink(2,2,true,false,true,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, true, false)
  )
})

tape('source(0, true, false) sink(2,2,true,false,false,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, true)
  )
})

tape('source(0, true, false) sink(2,2,true,false,false,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, false)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),true,true,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, true, true)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),true,true,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, true, false)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),true,false,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, false, true)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),true,false,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), true, false, false)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),false,true,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': false}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, true, true)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),false,true,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, true, false)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),false,false,true)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, false, true)
  )
})

tape('source(0, true, false) sink(2,2,new Error(),false,false,false)', function (t) {
  pull(
    reference.source(0, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'Sink Error', 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, new Error('Sink Error'), false, false, false)
  )
})

tape('source(0, true, true) through() sink()', function (t) {
  pull(
    reference.source(0, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'UO', 'TI', false),
    reference.through(),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through() sink()', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'TI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ], 'UO', 'TI', false),
    reference.through(),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through(Infinity, true, true, function (x) { return 2*x }) sink()', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'TI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ], 'UO', 'TI', false),
    reference.through(Infinity, true, true, function (x) { return 2 * x }),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 2},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through(1, true) sink()', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'UO', 'TI', false),
    reference.through(1, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through(1, new Error()) sink()', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'error', 'i': 1, 'err': 'Transformer Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'UO', 'TI', false),
    reference.through(1, new Error('Transformer Error')),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through(1, true, false) sink()', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': false}
    ], 'UO', 'TI', false),
    reference.through(1, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'TO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ], 'TO', 'DI', true),
    reference.sink()
  )
})

tape('source(1, true, true) through(1, true, false) sink(1, 1, true, false)', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': false}
    ], 'UO', 'TI', false),
    reference.through(1, true, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': false}
    ], 'TO', 'DI', true),
    reference.sink(1, 1, true, false)
  )
})

tape('source(1, true, true) through(1, true, true) sink(1, 1, true, false)', function (t) {
  pull(
    reference.source(1, true, true),
    monitor(t, [
      {'port': 'TI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': false}
    ], 'UO', 'TI', false),
    reference.through(1, true, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 1, 'cb': false}
    ], 'TO', 'DI', true),
    reference.sink(1, 1, true, false)
  )
})
