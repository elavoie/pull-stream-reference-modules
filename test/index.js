var tape = require('tape')
var pull = require('pull-stream')
var reference = require('../')
var reifier = require('pull-stream-protocol-reifier')
var log = require('debug')('pull-stream-reference-modules')

function monitor (t, expected) {
  var probe = reifier()
  var i = 0
  pull(
    probe.events,
    pull.drain(
      function (e) {
        log(e)
        t.deepEqual(e, expected[i++])
        if (i === expected.length) t.end()
        else if (i > expected.length) t.fail('Received more events than expected')
      },
      function (err) {
        if (err) t.fail(err)
      }
    )
  )
  return probe
}

tape('Source: source(0, Infinity, true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    pull.drain()
  )
})

tape('Source: source(0, 1, true)', function (t) {
  pull(
    reference.source(0, 1, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'error', 'i': 1, 'err': "Generated error at index '1'"}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(1, Infinity, true)', function (t) {
  pull(
    reference.source(1, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(1,1, true)', function (t) {
  pull(
    reference.source(1, 1, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'error', 'i': 1, 'err': "Generated error at index '1'"}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(1,2,true)', function (t) {
  pull(
    reference.source(1, 2, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'value', 'i': 1, 'v': 1},
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'error', 'i': 2, 'err': "Generated error at index '2'"}
    ]),
    pull.drain(null, function () {})
  )
})

tape('Source: source(2, Infinity, true)', function (t) {
  pull(
    reference.source(2, Infinity, true),
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

tape('source(0, Infinity, true) sink(2,2,true,true,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, true, true)
  )
})

tape('source(0, Infinity, true) sink(2,2,true,true,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, true, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,true,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,true,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, false, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,false,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, true, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,false,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, true, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,false,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, false, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,true,false,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,true,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, false, true, true, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,true,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, true, true, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,true,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, false, true, false, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,true,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, true, false, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,false,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': false}
    ]),
    reference.sink(2, 2, false, false, true, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,false,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, false, true, false)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,false,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': false}
    ]),
    reference.sink(2, 2, false, false, false, true)
  )
})

tape('source(0,Infinity,true) sink(2,2,false,false,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, true),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, false, false, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,true,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, true, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,true,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, true, true, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,true,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,true,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, true, true, false, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,false,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false}
    ]),
    reference.sink(2, 2, true, false, true, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,false,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, true, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,false,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,true,false,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'abort', 'i': 2, 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, true, false, false, false)
  )
})

// TODO:

tape('source(0, Infinity, false) sink(2,2,false,true,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, false, true, true, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,true,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, true, true, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,true,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, false, true, false, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,true,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 2}
    ]),
    reference.sink(2, 2, false, true, false, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,false,true,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': false}
    ]),
    reference.sink(2, 2, false, false, true, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,false,true,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, false, true, false)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,false,false,true)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, false, false, true)
  )
})

tape('source(0, Infinity, false) sink(2,2,false,false,false,false)', function (t) {
  pull(
    reference.source(0, Infinity, false),
    monitor(t, [
      {'port': 'DI', 'type': 'request', 'request': 'ask', 'i': 1, 'cb': true},
      {'port': 'DI', 'type': 'request', 'request': 'error', 'i': 2, 'err': 'ReferenceSink: Generated Error', 'cb': false},
      {'port': 'UO', 'type': 'answer', 'answer': 'done', 'i': 1}
    ]),
    reference.sink(2, 2, false, false, false, false)
  )
})
