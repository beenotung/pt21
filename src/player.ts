import { CardValue } from './data'
import { evalCards } from './engine'
const { floor, random, min, max } = Math

export abstract class Player {
  balance = 1000

  cardOnHand: CardValue[] = []

  abstract name: string

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
  getBet(): number {
    if (this.balance > 1000) {
      return 1
    }
    return floor(this.balance / 1000) + 1
  }

  shouldTake(): boolean {
    let res = this.checkCardOnHand()
    if (res.isDead) return false
    return res.maxScore <= 16
  }
}

export class GamblerPlayer extends SafePlayer {
  name = 'gambler-player'
}

// secret
// import 'ga-island'
