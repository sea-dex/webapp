const getCurrentIntervalStart = (interval: string) => {
  let seconds = 60

  switch (interval) {
    case '1m':
      seconds = 60
      break

    case '5m':
      seconds = 300
      break

    case '15m':
      seconds = 900
      break

    case '30m':
      seconds = 180
      break

    case '1h':
      seconds = 3600
      break

    case '4h':
      seconds = 3600 * 4
      break

    case '8h':
      seconds = 3600 * 8
      break

    case '12h':
      seconds = 3600 * 12
      break

    case '1d':
      seconds = 86400
      break

    case '1w':
      seconds = 86400 * 7
      break

    default:
      throw Error('invalid kline interval: ' + interval)
  }
  const now = Math.floor(new Date().getTime() / 1000)
  return Math.floor(now / seconds) * seconds
}

export { getCurrentIntervalStart }
