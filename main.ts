namespace SpriteKind {
    export const Pill = SpriteKind.create()
    export const Fruit = SpriteKind.create()
}
function setParameters () {
    info.setScore(0)
    pillScore = 10
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
    maze.cameraFollowHero()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (true) {
        nextLevel()
    }
})
function makeLevel () {
    numPills = 0
    numPillsEaten = 0
    for (let value of tiles.getTilesByType(assets.tile`tile_pill`)) {
        pillSprite = sprites.create(assets.image`sprite_pill`, SpriteKind.Pill)
        tiles.placeOnTile(pillSprite, value)
        numPills += 1
    }
    maze.freeze(true)
    maze.sendEvent("unfreeze", 1)
}
function spawnFruit () {
    fruitSprite = sprites.create(img`
        . . . . . . . 6 . . . . . . . . 
        . . . . . . 8 6 6 . . . 6 8 . . 
        . . . e e e 8 8 6 6 . 6 7 8 . . 
        . . e 2 2 2 2 e 8 6 6 7 6 . . . 
        . e 2 2 4 4 2 7 7 7 7 7 8 6 . . 
        . e 2 4 4 2 6 7 7 7 6 7 6 8 8 . 
        e 2 4 5 2 2 6 7 7 6 2 7 7 6 . . 
        e 2 4 4 2 2 6 7 6 2 2 6 7 7 6 . 
        e 2 4 2 2 2 6 6 2 2 2 e 7 7 6 . 
        e 2 4 2 2 4 2 2 2 4 2 2 e 7 6 . 
        e 2 4 2 2 2 2 2 2 2 2 2 e c 6 . 
        e 2 2 2 2 2 2 2 4 e 2 e e c . . 
        e e 2 e 2 2 4 2 2 e e e c . . . 
        e e e e 2 e 2 2 e e e c . . . . 
        e e e 2 e e c e c c c . . . . . 
        . c c c c c c c . . . . . . . . 
        `, SpriteKind.Fruit)
    tiles.placeOnTile(fruitSprite, tiles.getTilesByType(assets.tile`tile_fruit`)[0])
    maze.sendEvent("fruit_despawn", fruitTime)
    music.play(music.createSoundEffect(WaveShape.Sawtooth, 1, 4045, 255, 255, 250, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fruit, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(fruitSprite)
    info.changeScoreBy(fruitScore)
    maze.cancelEvent("fruit_despawn")
})
function cleanup () {
    maze.cancelAllEvents()
    sprites.destroy(fruitSprite)
    for (let value2 of sprites.allOfKind(SpriteKind.Pill)) {
        sprites.destroy(value2)
    }
}
function makeFruit (spawn: number, time: number, score: number) {
    fruitSpawn = spawn
    fruitTime = time
    fruitScore = score
}
function nextLevel () {
    cleanup()
    level += 1
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        makeLevel()
        makeFruit(20, 5, 200)
        makeHero(80)
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level7`)
        makeLevel()
        makeFruit(30, 10, 500)
        makeHero(80)
    } else {
        game.gameOver(true)
    }
}
maze.onEvent("unfreeze", function () {
    maze.freeze(false)
})
maze.onEvent("fruit_despawn", function () {
    sprites.destroy(fruitSprite)
    music.play(music.createSoundEffect(WaveShape.Sawtooth, 3760, 1, 142, 149, 250, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pill, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(WaveShape.Sine, 838, 2584, 120, 120, 60, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    sprites.destroy(otherSprite)
    numPillsEaten += 1
    info.changeScoreBy(pillScore)
    if (numPillsEaten == fruitSpawn) {
        spawnFruit()
    }
    if (numPillsEaten == numPills) {
        music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
        maze.freeze(true)
        maze.sendEvent("next_level", 2)
    }
})
maze.onEvent("next_level", function () {
    nextLevel()
})
let level = 0
let fruitSpawn = 0
let fruitScore = 0
let fruitTime = 0
let fruitSprite: Sprite = null
let pillSprite: Sprite = null
let numPillsEaten = 0
let numPills = 0
let pillScore = 0
setParameters()
game.splash("Welcome")
nextLevel()
