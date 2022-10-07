import { CardValue } from './data'
import { evalCards } from './engine'
const { floor, random, min, max } = Math

export abstract class Player {
  balance = 1000

  cardOnHand: CardValue[] = []

  abstract name: string

  lastBet = 0

  startGame(): number {
    this.cardOnHand.length = 0
    this.lastBet = this.getBet()
    return this.lastBet
  }

  isDead: boolean = false
  deadCount = 0
  nonDeadCount = 0
  endGame() {
    let scores = evalCards(this.cardOnHand)
    if (scores.length > 0 && scores.every(score => score > 21)) {
      this.isDead = true
      this.deadCount++
      return
    }
    this.isDead = false
    this.nonDeadCount++
  }

  abstract getBet(): number

  addCard(card: CardValue) {
    this.cardOnHand.push(card)
    // console.log(this.name, 'take card', {
    //   newCard: card,
    //   count: this.cardOnHand.length,
    //   maxScore: this.getMaxScore(),
    // })
  }

  getScores(): number[] {
    if (this.cardOnHand.length == 0) return []
    let scores = evalCards(this.cardOnHand)
    return scores
  }

  getMaxScore(): number {
    let scores = this.getScores()
     // .filter(score => score <= 21)
    if (scores.length == 0) return 0
    let result = max(...scores)
    if (result == 0) {
      debugger
    }
    return result
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

let alpha = 0.5
let beta = 1 - alpha

export class SafePlayer extends Player {
  name = 'safe-player'
  getBet(): number {
    if (this.balance > 1000) {
      return 1
    }
    return floor(this.balance / 1000) + 1
  }

  chance = 0.5

  shouldTake(): boolean {
    if (this.deadCount > this.nonDeadCount) {
      // reduce chance
      let t = this.nonDeadCount / this.deadCount
      this.chance = this.chance * alpha + t * beta
      console.log('reduce chance:', this.chance)
    } else if (this.deadCount < this.nonDeadCount) {
      // increase chance
      let t = this.deadCount / this.nonDeadCount
      this.chance = this.chance * alpha + t * beta
      console.log('increase chance:', this.chance)
    }
    return random() < this.chance
  }
}

export class GamblerPlayer extends Player {
  name = 'gambler-player'
  getBet(): number {
    if (this.balance > 1000) {
      return 1
    }
    return floor(this.balance / 1000) + 1
  }

  shouldTake(): boolean {
    return this.getMaxScore() <= 17
  }
}

// secret
// import 'ga-island'
