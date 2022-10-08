import { simulateBatch, simulateOnce } from './game'
import { GamblerPlayer, RandomPlayer, SafePlayer } from './player'

// let player = new RandomPlayer()
// let player = new SafePlayer()
let player = new GamblerPlayer()

// simulateOnce(player)
simulateBatch(player)
