import { CardValue, CardValues, getCardValue } from './data'

const { random, floor } = Math

export class Pool {
  values: CardValue[] = []

  constructor() {
    this.init()
  }

  init() {
    this.values.length = 0
    for (let i = 0; i < 4; i++) {
      this.values.push(...CardValues)
    }
  }

  nextCard(): CardValue {
    if (this.values.length == 0) {
      this.init()
    }
    let idx = random() * this.values.length
    idx = floor(idx)
    let value = this.values[idx]
    this.values.splice(idx, 1)
    return value
  }
}

export function evalCards(cards: CardValue[]): number[] {
  let scores: number[] = []

  function step(acc: number, rest: CardValue[]) {
    if (rest.length == 0) {
      scores.push(acc)
      return
    }
    let [head, ...tail] = rest
    let values = getCardValue(head)
    for (let value of values) {
      step(acc + value, tail)
    }
  }

  step(0, cards)

  return scores
}
