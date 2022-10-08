import { simulate } from './game'
import { GamblerPlayer, RandomPlayer, SafePlayer } from './player'

// let player = new RandomPlayer()
let player = new SafePlayer()
// let player = new GamblerPlayer()
simulate(player)
