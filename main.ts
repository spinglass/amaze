namespace SpriteKind {
    export const Pill = SpriteKind.create()
}
function makeHero (speed: number) {
    maze.createHero(img`
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . . f f d d d d d d f f . . 
        . . e f e 4 4 4 4 e f e . . 
        . e 4 f b 3 3 3 3 b f 4 e . 
        . 4 d f 3 3 3 3 3 3 c d 4 . 
        . 4 4 f 6 6 6 6 6 6 f 4 4 . 
        . . . . f f f f f f . . . . 
        . . . . f f . . f f . . . . 
        `)
    maze.setHeroSpeed(speed)
    maze.placeHero(assets.tile`tile_hero`)
}
function makeLevel () {
    numPills = 0
    numPillsEaten = 0
    for (let value of tiles.getTilesByType(assets.tile`tile_pill`)) {
        pillSprite = sprites.create(assets.image`sprite_pill`, SpriteKind.Pill)
        tiles.placeOnTile(pillSprite, value)
        numPills += 1
    }
}
function nextLevel () {
    level += 1
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        makeHero(80)
        makeLevel()
    } else {
        game.gameOver(true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pill, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(WaveShape.Sine, 838, 2584, 120, 120, 60, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    numPillsEaten += 1
    info.changeScoreBy(10)
    if (numPillsEaten == numPills) {
        nextLevel()
    }
})
let level = 0
let pillSprite: Sprite = null
let numPillsEaten = 0
let numPills = 0
game.splash("Welcome")
info.setScore(0)
nextLevel()
