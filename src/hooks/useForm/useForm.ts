import { useState, useMemo } from 'react'
import type { ChangeEventHandler, FormEventHandler } from 'react'

type Noop = () => void
type Submit<TValues> = (values: TValues) => void
type Handler<TValues> = {
  onChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: (submit: Submit<TValues>) => FormEventHandler
  reset: Noop
  isFilled: () => boolean
}

export const useForm = <TInitialValues>(initialValue: TInitialValues) => {
  const [values, setValues] = useState(initialValue)

  const handler: Handler<TInitialValues> = useMemo(
    () => ({
      onChange(e) {
        const { value, name } = e.target

        setValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }))
      },
      onSubmit(submit) {
        return (event) => {
          event.preventDefault()
          submit(values)
        }
      },
      reset() {
        setValues(initialValue)
      },
      isFilled() {
        const numberOfFields = Object.keys(values).length

        return Object.values(values).filter(Boolean).length === numberOfFields
      },
    }),
    [values, setValues]
  )

  return [values, handler] as const
}
