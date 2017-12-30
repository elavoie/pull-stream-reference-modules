function checkArgs (index, abort, answer, f) {
  if (typeof index !== 'number') {
    throw new Error("Invalid argument 'index': should be a number")
  }

  if (index < 1) {
    throw new Error("Invalid argument 'index': should be >= 1")
  }

  if (abort !== true && !(abort instanceof Error)) {
    throw new Error("Invalid argument 'abort': should be 'true' or an Error")
  }

  if (typeof answer !== 'boolean') {
    throw new Error("Invalid argument 'answer': should be a boolean value")
  }

  if (typeof f !== 'function') {
    throw new Error("Invalid argument 'f': should be a function")
  }
}

module.exports = function (index, abort, answer, f) {
  if (arguments.length < 1) index = Infinity
  if (arguments.length < 2) abort = true
  if (arguments.length < 3) answer = true
  if (arguments.length < 4) f = function (x) { return x }

  checkArgs(index, abort, answer, f)

  var j = 1
  return function input (request) {
    return function output (_abort, x) {
      var i = j++
      if (i === index) _abort = abort
      if (!answer || !x) {
        request(_abort)
        if (x) x(true)
      } else {
        request(_abort, function (done, v) {
          if (done) {
            return x(done)
          } else if (!done) {
            return x(done, f(v))
          }
        })
      }
    }
  }
}
