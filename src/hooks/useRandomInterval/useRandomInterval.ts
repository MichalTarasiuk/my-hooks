const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const useRandomInterval = (
  callback: Function,
  minDelay: number,
  maxDelay: number
) => {
  const timeoutId = React.useRef<number | null>(null)
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    const handleTick = () => {
      const nextTickAt = random(minDelay, maxDelay)

      timeoutId.current = window.setTimeout(() => {
        savedCallback.current()

        handleTick()
      }, nextTickAt)
    }

    handleTick()

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [minDelay, maxDelay])

  const cancel = React.useCallback(function () {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current)
    }
  }, [])

  return cancel
}
