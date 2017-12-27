function checkArgs (n, ue, sync) {
  if (typeof n !== 'number') {
    throw new Error("Invalid argument: 'n' should be a number")
  }

  if (n < 0) {
    throw new Error("Invalid argument: 'n' should be greater or equal to zero")
  }

  if (typeof ue === 'undefined') {
    ue = Infinity
  }

  if (typeof ue !== 'number') {
    throw new Error("Invalid argument: 'ue' should be a number")
  }

  if (ue < 1) {
    throw new Error("Invalid argument: 'ue' should be greater or equal to one")
  }

  if (typeof sync !== 'boolean') {
    throw new Error("Invalid argument: 'sync' should be a boolean value")
  }
}

module.exports = function (n, ue, sync) {
  checkArgs(n, ue, sync)
  var i = 1

  function answer (x, args) {
    if (sync) {
      x.apply(this, args)
    } else {
      setImmediate(function () { x.apply(this, args) })
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

    if (!abort && i !== ue && i <= n) {
      return answer(x, [false, i++])
    } else if (!abort && i !== ue && i === n + 1) {
      return answer(x, [true])
    } else if (abort === true && i !== ue) {
      return answer(x, [true])
    } else if (abort && i !== ue) {
      return answer(x, [true])
    } else if (i === ue) {
      return answer(x, [new Error("Generated error at index '" + ue + "'")])
    } else if (!abort && i !== ue && i > n + 1) {
      return answer(x, [new Error("Requesting values after termination at index '" + i + "'")])
    } else {
      throw new Error('Unhandled parameter combination in reference source')
    }
  }
}
