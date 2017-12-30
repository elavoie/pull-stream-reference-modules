# pull-stream-reference-modules

Reference modules for checking the correctness of other modules.

# Usage

````
var pull = require('pull-stream')
var reference = require('pull-stream-reference-modules')

pull(
  reference.source(3),
  reference.through(),
  reference.sink()
)

````

# source([n][, done][, sync])

* ````n````     ````<Number>```` (>=0)      (Defaults to ````Infinity````)
* ````done````  ````<Boolean> | <Error>```` (Defaults to ````true````)
* ````sync````  ````<Boolean>````           (Defaults to ````true````)

Creates a stream that outputs ````1 ... n```` and terminates the stream with the ````done```` value at index ````n+1````. If ````sync===true````, answer synchronously by immediately invoking the answer callback; otherwise delay the answer by queuing the callback with ````setImmediate````.

# sink([r][, index][, abort][, answer][, sync][, cont])

* ````r````         ````<Number>```` (>=1)         (Defaults to ````Infinity````)
* ````index````     ````<Number>```` (1<=index<=r) (Defaults to ````r````)
* ````abort````     ````<Boolean> | <Error>````    (Defaults to ````true````)
* ````answer````    ````<Boolean>````              (Defaults to ````true````)
* ````sync````      ````<Boolean>````              (Defaults to ````true````)
* ````cont````      ````<Boolean>````              (Defaults to ````false````)

Makes ````r```` requests. ````index```` is the index from which the sink will initiate termination request(s). ````abort```` is the value with which the termination requests will be initiated (````true```` for a normal abort and ````Error```` for an abnormal abort). If ````answer===true```` an answer is expected after a termination request (an answer callback is provided). If ````sync===true````, waits for the previous answer before issuing the next termination request; otherwise initiates it right away (````sync===false```` is useful to simulate the behavior of a sink that aborts on a request that takes to long to provide an answer). If ````cont===false````, stops making requests after the source terminated; otherwise keep making terminating requests (useful to test module behaviour when terminating multiple times).

# through([index][, abort][, answer][, f])

* ````index````  ````<Number>```` (>=1)           (Defaults to ````Infinity````)
* ````abort````  ````<Boolean> | <Error>````      (Defaults to ````true````)
* ````answer```` ````<Boolean>````                (Defaults to ````true````)
* ````f````      ````<Function>````               (Defaults to ````function (x) { return x }````)

Propagates requests from its output to its input. Propagates answers from its input to its output. May terminate early before the downstream module by setting a finite ````index````, in which case it will abort with the ````abort```` value even if the downstream module has not initiated a termination request. If ````answer===true```` an answer from upstream is expected when aborting (a callback is provided); otherwise no answer is expected (no callback is provided).  ````f```` is a processing function that modifies the values coming from the input before passing them to the output.

