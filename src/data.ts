export let CardValues = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const

export type CardValue = typeof CardValues[number]

export function getCardValue(value: CardValue): number[] {
  switch (value) {
    case 'A':
      return [1, 11]
    case 'J':
    case 'Q':
    case 'K':
      return [10]
    default:
      return [+value]
  }
}
