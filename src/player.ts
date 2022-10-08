import { CardValue } from './data'
import { evalCards } from './engine'
const { floor, round, random, min, max } = Math

export abstract class Player {
  balance = 1000

  cardOnHand: CardValue[] = []

  abstract name: string

  reset() {
    this.balance = 1000
  }

  startGame(): number {
    this.cardOnHand.length = 0
    return this.getBet()
  }

  abstract getBet(): number

  addCard(card: CardValue) {
    this.cardOnHand.push(card)
    // let check = this.checkCardOnHand()
    // console.log(this.name, 'take card', {
    //   newCard: card,
    //   count: this.cardOnHand.length,
    //   maxScore: check.maxScore,
    //   isDead: check.isDead,
    // })
  }

  getScores(): number[] {
    if (this.cardOnHand.length == 0) return []
    let scores = evalCards(this.cardOnHand)
    return scores
  }

  checkCardOnHand() {
    let scores = this.getScores()
    let validScores = scores.filter(score => score <= 21)
    let maxScore = max(0, ...validScores)
    let isDead = scores.length > 0 && validScores.length == 0
    return { isDead, maxScore }
  }

  abstract shouldTake(): boolean
}

export class Host extends Player {
  name = 'host'
  getBet(): number {
    return 0
  }

  shouldTake(): boolean {
    if (this.cardOnHand.length == 0) return true
    let hostScores = evalCards(this.cardOnHand)
    if (hostScores.some(score => score >= 17)) return false
    return true
  }
}

export class RandomPlayer extends Player {
  name = 'random-player'
  getBet(): number {
    let bet = random() * 100
    bet = floor(bet)
    bet = min(this.balance, bet)
    return bet
  }

  shouldTake(): boolean {
    return Math.random() > 0.5
  }
}

export class SafePlayer extends Player {
  name = 'safe-player'

  lastBalance = this.balance

  reset() {
    super.reset()
    this.lastBalance = this.balance
  }

  getBet(): number {
    let defer = (res: number) => {
      this.lastBalance = this.balance
      return res
    }
    if (this.balance > this.lastBalance) {
      // last win
      return defer(1)
    } else if (this.balance < this.lastBalance) {
      // last lose
      return defer(3)
    } else {
      // last draw
      return defer(2)
    }
  }

  shouldTake(): boolean {
    let res = this.checkCardOnHand()
    if (res.isDead) return false
    return res.maxScore <= 16
  }
}

export class GamblerPlayer extends Player {
  name = 'gambler-player'

  lastBalance = this.balance
  lastBet = 1

  reset() {
    super.reset()
    this.lastBalance = this.balance
    this.lastBet = 1
  }

  getBet(): number {
    let defer = () => {
      this.lastBalance = this.balance
      if (this.lastBet > this.balance) {
        this.lastBet = this.balance
      }
      return this.lastBet
    }

    if (this.balance > this.lastBalance) {
      // last win
      this.lastBet = 1
      return defer()
    } else if (this.balance < this.lastBalance) {
      // last lose
      // let rate = 2 // can have >5k last balance
      // let rate = 2.5 // can have >30k last balance
      let rate = 3 // can have >100k last balance
      this.lastBet = round(this.lastBet * rate)
      return defer()
    } else {
      // last draw
      return defer()
    }
  }

  shouldTake(): boolean {
    let res = this.checkCardOnHand()
    if (res.isDead) return false
    return res.maxScore <= 16
  }
}

// secret
// import 'ga-island'
