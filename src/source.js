function checkArgs (n, ue) {
  if (typeof n !== 'number') {
    throw new Error("Invalid argument: 'n' should be a number")
  }

  if (n < 0) {
    throw new Error("Invalid argument: 'n' should be greater or equal to zero")
  }

  if (typeof ue !== 'number') {
    throw new Error("Invalid argument: 'ue' should be a number")
  }

  if (ue < 1) {
    throw new Error("Invalid argument: 'ue' should be greater or equal to one")
  }
}

module.exports = function (n, ue) {
  checkArgs(n, ue)
  var i = 1

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
      return x(false, i++)
    } else if (!abort && i !== ue && i === n + 1) {
      return x(true)
    } else if (abort === true && i !== ue) {
      return x(true)
    } else if (abort && i !== ue) {
      return x(true)
    } else if (i === ue) {
      return x(new Error("Generated error at index '" + ue + "'"))
    } else if (!abort && i !== ue && i > n + 1) {
      return x(new Error("Requesting values after termination at index '" + i + "'"))
    } else {
      throw new Error('Unhandled parameter combination in reference source')
    }
  }
}
