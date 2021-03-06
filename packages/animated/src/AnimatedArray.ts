import { isAnimatedString } from '@react-spring/shared'
import { AnimatedObject } from './AnimatedObject'
import { AnimatedString } from './AnimatedString'
import { AnimatedValue } from './AnimatedValue'

type Value = number | string
type Source = AnimatedValue<Value>[]

/** An array of animated nodes */
export class AnimatedArray<
  T extends ReadonlyArray<Value> = Value[]
> extends AnimatedObject {
  protected source!: Source
  constructor(from: T, to?: T) {
    super(null)
    super.setValue(this._makeAnimated(from, to))
  }

  static create<T extends ReadonlyArray<Value>>(from: T, to?: T) {
    return new AnimatedArray(from, to)
  }

  getValue(): T {
    return this.source.map(node => node.getValue()) as any
  }

  setValue(newValue: T | null) {
    const payload = this.getPayload()
    // Reuse the payload when lengths are equal.
    if (newValue && newValue.length == payload.length) {
      return payload.some((node, i) => node.setValue(newValue[i]))
    }
    // Remake the payload when length changes.
    this.source = this._makeAnimated(newValue)
    this.payload = this._makePayload(this.source)
    return true
  }

  /** Convert the `from` and `to` values to an array of `Animated` nodes */
  protected _makeAnimated(
    from: T | null,
    to: T = from!
  ): AnimatedValue<Value>[] {
    return from
      ? from.map((from, i) =>
          (isAnimatedString(from) ? AnimatedString : AnimatedValue).create(
            from,
            to[i]
          )
        )
      : []
  }
}
