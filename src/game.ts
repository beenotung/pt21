import { Pool } from './engine'
import { GamblerPlayer, Host, RandomPlayer, SafePlayer } from './player'

export function simulate() {
  let pool = new Pool()
  let host = new Host()
  // let player = new RandomPlayer()
  // let player = new SafePlayer()
  let player = new GamblerPlayer()

  let players = [player, host]

  function oneRound() {
    let bet = player.startGame()
    host.startGame()

    for (let player of players) {
      player.addCard(pool.nextCard())
      player.addCard(pool.nextCard())
      while (player.shouldTake()) {
        player.addCard(pool.nextCard())
      }
      player.endGame()
      if (player.isDead) {
        // console.log(player.name, 'dead')
        // continue
      }
    }

    if (host.isDead && player.isDead) {
      return
    }

    if (player.isDead) {
      player.balance -= bet
      return
    }

    if (host.isDead) {
      player.balance += bet
      return
    }

    let playerScore = player.getMaxScore()
    let hostScore = host.getMaxScore()

    if (playerScore == hostScore) {
      if (hostScore == 21) {
        player.balance -= bet
      }
      return
    }

    let isPlayerWin = playerScore > hostScore
    if (isPlayerWin) {
      player.balance += bet
    } else {
      player.balance -= bet
    }
  }

  for (let i = 1; i <= 10000 && player.balance >= 1; i++) {
    oneRound()
    console.log({
      round: i,
      bet: player.lastBet,
      balance: player.balance,
      hostCards: host.cardOnHand,
      playerCards: player.cardOnHand,
    })
  }

  console.log('final balance:', player.balance)
}
