export const MAX_NEED = 5

const INITIAL_STOCK = 10
const DAYS_UNTIL_DEATH = 3
const EARLIEST_END_DAY = 15
const LATEST_END_DAY = 55

export function createGame(team, endRoll) {
  return {
    day: 1,
    lastDay:
      EARLIEST_END_DAY +
      Math.floor(endRoll * (LATEST_END_DAY - EARLIEST_END_DAY + 1)),
    outcome: null,
    stock: {
      food: INITIAL_STOCK,
      water: INITIAL_STOCK,
      medicine: INITIAL_STOCK,
    },
    characters: team.map((character) => ({
      ...character,
      food: MAX_NEED,
      water: MAX_NEED,
      status: 'healthy',
      sickDays: 0,
    })),
    log: ['La partie commence. Les jauges de l’équipe sont pleines.'],
  }
}

export function canUseProvision(game, character, resource) {
  if (
    !character ||
    character.status === 'dead' ||
    game.outcome ||
    !(game.stock[resource] > 0)
  ) {
    return false
  }

  return resource === 'medicine'
    ? character.status === 'sick'
    : character[resource] < MAX_NEED
}

function spendProvision(game, characterId, resource) {
  const character = game.characters.find(({ id }) => id === characterId)
  if (!canUseProvision(game, character, resource)) return game

  const treated =
    resource === 'medicine'
      ? { ...character, status: 'healthy', sickDays: 0 }
      : { ...character, [resource]: character[resource] + 1 }

  const messages = {
    food: character.name + ' mange une portion.',
    water: character.name + ' boit une ration d’eau.',
    medicine: character.name + ' est de nouveau en bonne santé.',
  }

  return {
    ...game,
    stock: { ...game.stock, [resource]: game.stock[resource] - 1 },
    characters: game.characters.map((player) =>
      player.id === characterId ? treated : player,
    ),
    log: [...game.log, messages[resource]],
  }
}

function applyDailyEvent(characters, rolls, log) {
  const living = characters.filter(({ status }) => status !== 'dead')
  if (rolls.event >= 0.7) {
    log.push('Aucun nouvel incident aujourd’hui.')
    return characters
  }

  if (rolls.event >= 0.5) {
    const healthy = living.filter(({ status }) => status === 'healthy')
    if (!healthy.length) {
      log.push('Aucun nouveau cas de maladie aujourd’hui.')
      return characters
    }

    const target = healthy[Math.floor(rolls.target * healthy.length)]
    log.push(target.name + ' est malade.')
    return characters.map((player) =>
      player.id === target.id ? { ...player, status: 'sick' } : player,
    )
  }

  const resource = rolls.event < 0.25 ? 'water' : 'food'
  const target = living[Math.floor(rolls.target * living.length)]
  const loss = Math.min(target[resource], Math.floor(rolls.loss * 3) + 1)
  const remaining = target[resource] - loss
  const supply = resource === 'food' ? ' de nourriture.' : ' d’eau.'
  log.push(
    target.name +
      ' perd ' +
      loss +
      (loss === 1 ? ' point' : ' points') +
      supply,
  )
  if (remaining === 0)
    log.push(target.name + ' n’a pas survécu à cette journée.')

  return characters.map((player) =>
    player.id === target.id
      ? {
          ...player,
          [resource]: remaining,
          status: remaining === 0 ? 'dead' : player.status,
        }
      : player,
  )
}

function progressIllness(character, log) {
  if (character.status !== 'sick') return character

  const sickDays = character.sickDays + 1
  if (sickDays < DAYS_UNTIL_DEATH) return { ...character, sickDays }

  log.push(character.name + ' n’a pas survécu à la maladie.')
  return { ...character, status: 'dead', sickDays }
}

function nextDay(game, rolls) {
  if (game.outcome) return game

  const day = game.day + 1
  const log = []
  const characters = applyDailyEvent(game.characters, rolls, log).map(
    (character) => progressIllness(character, log),
  )
  const survivors = characters.filter(({ status }) => status !== 'dead').length
  let outcome = null
  if (survivors === 0) {
    outcome = 'lost'
    log.unshift('Toute l’équipe a péri. La partie est terminée.')
  } else if (day >= game.lastDay) {
    outcome = 'won'
    log.unshift(
      'Le confinement est terminé. Survivants : ' +
        survivors +
        ' sur ' +
        characters.length +
        '.',
    )
  }

  return { ...game, day, characters, log, outcome }
}

export function gameReducer(game, action) {
  if (action.type === 'use-provision') {
    return spendProvision(game, action.characterId, action.resource)
  }
  if (action.type === 'next-day') return nextDay(game, action.rolls)

  return game
}
