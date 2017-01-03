# node-rfswitch
Control RF outlets from nodejs.

This library was inspired by [node-rcswitch](https://github.com/marvinroger/node-rcswitch) but instead of creating bindings for [rcswitch-pi](https://github.com/r10r/rcswitch-pi) this library uses [node-rpio](https://github.com/jperkin/node-rpio) to control the GPIO.

## Installation

The latest version can be installed via npm

```console
$ npm install rfswitch
```

Make sure that `/dev/gpiomem` exists and is writeable by you (usually by adding yourself to the `gpio` group).

If `/dev/gpiomem` exists but is not owned by the group `gpio` (e.g. on Arch Linux) see [here](https://github.com/jperkin/node-rpio/blob/master/README.md#install).

## Usage

Import rfswitch

```js
const RFSwitch = require('./index.js')
```

Create a switch

```js
let group = '0F00F'
let unit = 'FF0FF'
let options = {
  onCode: group + unit + '0F',
  offCode: group + unit + 'F0'
}
let s = new RFSwitch(options)
```

Turn the switch on/off

```js
s.switchOn()
s.switchOff()
```

### Options

#### `pin`

The pin to which the sender is connected (using the BCM based GPIO numbering, defaults to `17`)

#### `protocol.tristate`

Defines if the protocol uses tristate (`0` = `00`, `1` = `11`, `F` = `01`)

#### `protocol.pulseLength`

The length of one pulse in &micro;s

#### `protocol.zero`, `.one`, `.sync`

The number of high and low pulses that equal a binary zero and one as well as the pulses used for synchronization (e.g. `{high: 1, low: 3}`).

#### `onCode`, `offCode`

The code used to turn the switch on/off. Some info on finding those codes can be found [here](https://github.com/sui77/rc-switch/wiki/HowTo_OperateLowCostOutlets)

#### `repeat`

How should each code be send (defaults to 10 times)

### Advanced

Use `RFSwitch.send` to send a `code` directly using a given `pin` and `protocol`

```js
let pin = 17
let code = '0F00FFF0FF0F'
let protocol = {
  tristate: true,
  pulseLength: 350,
  zero: {high: 1, low: 3},
  one: {high: 3, low: 1},
  sync: {high: 1, low: 31}
}
RFSwitch.send(pin, code, protocol)
```
