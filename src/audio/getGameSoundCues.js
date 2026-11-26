const provisionCues = ['food', 'water', 'medicine']

export function getGameSoundCues(previous, current) {
  if (previous.day === current.day) {
    return provisionCues.filter(
      (name) => current.stock[name] < previous.stock[name],
    )
  }

  const cues = ['day']
  for (const status of ['sick', 'dead']) {
    const changed = current.characters.some(
      (character, index) =>
        character.status === status &&
        previous.characters[index].status !== status,
    )
    if (changed) cues.push(status === 'dead' ? 'death' : 'sick')
  }

  return cues
}
