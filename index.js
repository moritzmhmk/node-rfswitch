const rpio = require('rpio')

rpio.init({mapping: 'gpio'})

const defaultProtocol = {
  tristate: true,
  pulseLength: 350,
  zero: {high: 1, low: 3},
  one: {high: 3, low: 1},
  sync: {high: 1, low: 31}
}

class RFSwitch {
  constructor (options = {}) {
    this.pin = options.pin || 17
    this.protocol = Object.assign({}, defaultProtocol, options.protocol)
    this.onCode = options.onCode
    this.offCode = options.offCode
    this.repeat = options.repeat || 10
    rpio.open(this.pin, rpio.OUTPUT)
  }
  switchOn () {
    for (let i = 0; i < this.repeat; i++) {
      RFSwitch.send(this.pin, this.onCode, this.protocol)
    }
  }
  switchOff () {
    for (let i = 0; i < this.repeat; i++) {
      RFSwitch.send(this.pin, this.offCode, this.protocol)
    }
  }
  static send (pin, code, protocol = {}) {
    RFSwitch.transmit(pin, protocol.sync, protocol.pulseLength)
    for (let i = 0; i < code.length; i++) {
      const char = code.charAt(i)
      if (char === '0') { RFSwitch.transmit(pin, protocol.zero, protocol.pulseLength) }
      if (char === '0' && protocol.tristate) { RFSwitch.transmit(pin, protocol.zero, 
protocol.pulseLength) }

      if (char === '1') { RFSwitch.transmit(pin, protocol.one, protocol.pulseLength) }
      if (char === '1' && protocol.tristate) { RFSwitch.transmit(pin, protocol.one, 
protocol.pulseLength) }

      if (char === 'F' && protocol.tristate) { RFSwitch.transmit(pin, protocol.zero, 
protocol.pulseLength) }
      if (char === 'F' && protocol.tristate) { RFSwitch.transmit(pin, protocol.one, 
protocol.pulseLength) }
    }
  }

  static transmit (pin, pulses, pulseLength) {
    rpio.write(pin, rpio.HIGH)
    rpio.usleep(pulseLength * pulses.high)
    rpio.write(pin, rpio.LOW)
    rpio.usleep(pulseLength * pulses.low)
  }
}

module.exports = RFSwitch
