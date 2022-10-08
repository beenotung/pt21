import { Pool } from './engine'
import { GamblerPlayer, Host, Player } from './player'

let pool = new Pool()
let host = new Host()

export function evalPlayer(player: Player) {
  let players = [host, player]

  player.reset()

  for (let round = 1; round <= 10000 && player.balance >= 1; round++) {
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

    if (playerCheck.isDead && hostCheck.isDead) {
      // draw, both dead
      continue
    }

    if (playerCheck.isDead) {
      player.balance -= bet
      continue
    }

    if (hostCheck.isDead) {
      player.balance += bet
      continue
    }

    if (playerCheck.maxScore == hostCheck.maxScore) {
      if (hostCheck.maxScore == 21) {
        player.balance -= bet
      }
      continue
    }

    if (playerCheck.maxScore > hostCheck.maxScore) {
      player.balance += bet
    } else {
      player.balance -= bet
    }
  }

  return player.balance
}
