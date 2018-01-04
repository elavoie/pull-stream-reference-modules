function checkArgs (n, done, sync) {
  if (typeof n !== 'number') {
    throw new Error("Invalid argument: 'n' should be a number")
  }

  if (n < 0) {
    throw new Error("Invalid argument: 'n' should be greater or equal to zero")
  }

  if (done !== true && !(done instanceof Error)) {
    throw new Error("Invalid argument: 'done' should be 'true' or an Error")
  }

  if (typeof sync !== 'boolean') {
    throw new Error("Invalid argument: 'sync' should be a boolean value")
  }
}

module.exports = function (n, done, sync) {
  if (arguments.length < 1) {
    n = Infinity
  }

  if (arguments.length < 2) {
    done = true
  }

  if (arguments.length < 3) {
    sync = true
  }

  checkArgs(n, done, sync)
  var i = 1
  var ended = false

  function answer (x, args) {
    if (sync) {
      x.apply(this, args)
    } else {
      setImmediate(function () {
        if (ended) {
          x.call(this, ended)
        } else {
          x.apply(this, args)
        }
      })
    }
  }

  return function source (abort, x) {
    if (!abort) {
      if (x === undefined) {
        throw new Error('Expecting a callback function when a value is asked (abort=false)')
      }
    } else {
      if (x === undefined) {
        return
      } else if (typeof x !== 'function') {
        throw new Error("Invalid callback type '" + (typeof x) + "', expected a function")
      }
    }

    if (ended) {
      return answer(x, [ended])
    } else if (!abort && i <= n) {
      return answer(x, [false, i++])
    } else if (!abort && i === n + 1) {
      return answer(x, [done])
    } else if (abort) {
      ended = abort
      return answer(x, [true])
    } else if (!abort && i > n + 1) {
      throw new Error('Invalid ask request after termination')
    } else {
      throw new Error('Unhandled parameter combination in reference source')
    }
  }
}
