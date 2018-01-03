function checkArgs (r, index, abort, answer, sync, cont, doneCb) {
  if (typeof r !== 'number') {
    throw new Error("Invalid argument 'r' of type '" + (typeof r) + "': should be a number")
  }

  if (r < 1) {
    throw new Error("Invalid argument 'r' of value '" + r + "': should be a number >= 1")
  }

  if (typeof index !== 'number') {
    throw new Error("Invalid argument 'index' of type '" + (typeof index) + "': should be a number")
  }

  if (index < 1 || index > r) {
    throw new Error("Invalid argument 'index' of value '" + index + "': should be 1 <= index <= r")
  }

  if (abort !== true && !(abort instanceof Error)) {
    throw new Error("Invalid argument 'abort' of type '" + (typeof abort) + "': should be 'true' or an Error")
  }

  if (typeof answer !== 'boolean') {
    throw new Error("Invalid argument 'answer' of type '" + (typeof answer) + "': should be a boolean value")
  }

  if (typeof sync !== 'boolean') {
    throw new Error("Invalid argument 'sync' of type '" + (typeof sync) + "': should be a boolean value")
  }

  if (typeof cont !== 'boolean') {
    throw new Error("Invalid argument 'cont' of type '" + (typeof cont) + "': should be a boolean value")
  }

  if (typeof doneCb !== 'function') {
    throw new Error("Invalid argument 'doneCb' of type '" + (typeof doneCb) + "': should be a function")
  }
}

module.exports = function (r, index, abort, answer, sync, cont, doneCb) {
  if (arguments.length < 1) r = Infinity
  if (arguments.length < 2) index = r
  if (arguments.length < 3) abort = true
  if (arguments.length < 4) answer = true
  if (arguments.length < 5) sync = true
  if (arguments.length < 6) cont = false
  if (arguments.length < 7) doneCb = function () {}

  checkArgs(r, index, abort, answer, sync, cont, doneCb)

  return function sink (request) {
    function ask (i, terminate) {
      function doRequest () {
        if (i < index - 1) {
          request(false, x)
        } else if (i === index - 1 && sync) {
          request(false, x)
        } else if (i === index - 1 && !sync) {
          var done = false
          request(false, function (_done) {
            done = _done
          })
          if (cont || !done) {
            terminate(abort, ++i)
          } else if (done && !cont) {
            doneCb()
          }
        } else if (i >= index) {
          terminate(abort, i)
        }
      }
      function x (done, v) {
        if (done && !cont) {
          return doneCb()
        }
        ++i
        doRequest()
      }

      doRequest()
    }

    function terminate (abort, i) {
      if (answer) {
        terminateX(abort, i)
      } else {
        terminateNoX(abort, i)
      }
    }

    function terminateX (abort, i) {
      function x (done) {
        terminateX(abort, i + 1)
      }

      if (i > r) {
        return doneCb()
      }

      if (i < index) {
        request(abort, x)
      } else if (i >= index) {
        if (sync) {
          request(abort, x)
        } else {
          while (i++ < r) {
            request(abort, function () {})
          }

          if (i >= r) {
            request(abort, function () {
              doneCb()
            })
          }
        }
      }
    }

    function terminateNoX (abort, i) {
      if (i > r) {
        return doneCb()
      }

      while (i++ <= r) {
        request(abort)
      }

      doneCb()
    }

    ask(1, terminate)
  }
}
