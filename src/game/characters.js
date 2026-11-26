const assetsDirectory = import.meta.env.BASE_URL + 'assets/'
const portraitDirectory = assetsDirectory + 'normal/'

export const TEAM_SIZE = 4

export const CHARACTERS = [
  {
    id: 'adrien',
    name: 'Adrien',
    portrait: portraitDirectory + 'adrien.png',
    width: 201,
    height: 379,
  },
  {
    id: 'clement',
    name: 'Clément',
    portrait: portraitDirectory + 'clément.png',
    width: 168,
    height: 378,
  },
  {
    id: 'estelle',
    name: 'Estelle',
    portrait: portraitDirectory + 'estelle.png',
    width: 201,
    height: 380,
  },
  {
    id: 'islem',
    name: 'Islem',
    portrait: portraitDirectory + 'islem.png',
    width: 251,
    height: 379,
  },
  {
    id: 'rudy',
    name: 'Rudy',
    portrait: portraitDirectory + 'rudy.png',
    width: 186,
    height: 378,
  },
  {
    id: 'zely',
    name: 'Zély',
    portrait: portraitDirectory + 'zély.png',
    width: 200,
    height: 377,
  },
]

export function getCharacterPortrait(character) {
  if (character.status === 'healthy') return character.portrait

  const folder = character.status === 'sick' ? 'sick' : 'death'
  const filename = character.portrait.split('/').at(-1)
  return (
    assetsDirectory + folder + '/' + filename.replace('.png', folder + '.png')
  )
}
