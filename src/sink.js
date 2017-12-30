function checkArgs (r, index, abort, answer, sync, cont) {
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
}

module.exports = function (r, index, abort, answer, sync, cont) {
  if (arguments.length < 1) r = Infinity
  if (arguments.length < 2) index = r
  if (arguments.length < 3) abort = true
  if (arguments.length < 4) answer = true
  if (arguments.length < 5) sync = true
  if (arguments.length < 6) cont = false

  checkArgs(r, index, abort, answer, sync, cont)

  return function sink (request) {
    function ask (i, terminate) {
      function doRequest () {
        if (i < index - 1) {
          request(false, x)
        } else if (sync && i < index) {
          request(false, x)
        } else if (i === index - 1) {
          var done = false
          request(false, function (_done) {
            done = _done
          })
          if (cont || !done) {
            terminate(abort, ++i)
          }
        } else if (i >= index) {
          terminate(abort, i)
        }
      }
      function x (done, v) {
        if (done && !cont) return
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

      if (i > r) return

      if (i < index) {
        request(abort, x)
      } else if (i >= index) {
        if (sync) {
          request(abort, x)
        } else {
          while (i++ <= r) {
            request(abort, function () {})
          }
        }
      }
    }

    function terminateNoX (abort, i) {
      if (i > r) return

      while (i++ <= r) {
        request(abort)
      }
    }

    ask(1, terminate)
  }
}
