import { Pool } from './engine'
import { evalPlayer } from './ga'
import { Host, Player } from './player'

export function simulateOnce(player: Player) {
  let pool = new Pool()
  let host = new Host()
  player.reset()

  let players = [player, host]

  for (let i = 1; i <= 10000 && player.balance >= 1; i++) {
    function report(status: 'win' | 'lose' | 'draw') {
      console.log({
        round: i,
        status,
        bet,
        balance: player.balance,
        hostCards: host.cardOnHand,
        playerCards: player.cardOnHand,
        hostCheck,
        playerCheck,
      })
    }
    let bet = player.startGame()
    host.startGame()

    for (let player of players) {
      player.addCard(pool.nextCard())
      player.addCard(pool.nextCard())
      while (player.shouldTake()) {
        player.addCard(pool.nextCard())
      }
    }

    let playerCheck = player.checkCardOnHand()
    let hostCheck = host.checkCardOnHand()

    if (hostCheck.isDead && playerCheck.isDead) {
      report('draw')
      continue
    }

    if (playerCheck.isDead) {
      player.balance -= bet
      report('lose')
      continue
    }

    if (hostCheck.isDead) {
      player.balance += bet
      report('win')
      continue
    }

    if (playerCheck.maxScore == hostCheck.maxScore) {
      if (hostCheck.maxScore == 21) {
        player.balance -= bet
        report('lose')
      } else {
        report('draw')
      }
      continue
    }

    let isPlayerWin = playerCheck.maxScore > hostCheck.maxScore
    if (isPlayerWin) {
      player.balance += bet
      report('win')
    } else {
      player.balance -= bet
      report('lose')
    }
  }

  console.log('final balance:', player.balance)
}

export function simulateBatch(player: Player) {
  for (let i = 0; i < 100; i++) {
    let balance = evalPlayer(player)
    console.log('f', i, balance)
  }
}
