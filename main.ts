namespace SpriteKind {
    export const Pill = SpriteKind.create()
    export const Fruit = SpriteKind.create()
    export const Chaser = SpriteKind.create()
}
function setParameters () {
    info.setScore(0)
    info.setLife(3)
    pillScore = 10
}
function makeHero () {
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
    maze.cameraFollowHero()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Chaser, function (sprite, otherSprite) {
    if (!(maze.isFrozen())) {
        maze.freeze(true)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        info.changeLifeBy(-1)
        maze.sendEvent("restart", 1)
    }
})
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
    chaserBases = tiles.getTilesByType(assets.tile`tile_chaser`)
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
function makeChasers () {
    chaserDuck = maze.createChaser(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . b 5 5 b . . . 
        . . . . . . b b b b b b . . . . 
        . . . . . b b 5 5 5 5 5 b . . . 
        . b b b b b 5 5 5 5 5 5 5 b . . 
        . b d 5 b 5 5 5 5 5 5 5 5 b . . 
        . . b 5 5 b 5 d 1 f 5 d 4 f . . 
        . . b d 5 5 b 1 f f 5 4 4 c . . 
        b b d b 5 5 5 d f b 4 4 4 4 b . 
        b d d c d 5 5 b 5 4 4 4 4 4 4 b 
        c d d d c c b 5 5 5 5 5 5 5 b . 
        c b d d d d d 5 5 5 5 5 5 5 b . 
        . c d d d d d d 5 5 5 5 5 d b . 
        . . c b d d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        `)
}
function placeChaser (id: number, speed: number) {
    if (chaserBases.length > 0) {
        maze.placeChaser(0, chaserBases.shift())
    }
}
function cleanup () {
    maze.reset()
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
    console.log(fruitSpawn)
    console.log(fruitTime)
    console.log(fruitScore)
}
maze.onEvent("restart", function () {
    maze.restart()
    maze.sendEvent("unfreeze", 1)
})
function nextLevel () {
    cleanup()
    level += 1
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        makeLevel()
        makeFruit(20, 5, 200)
        placeHero(80)
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level1`)
        makeLevel()
        makeFruit(20, 5, 500)
        placeHero(80)
        placeChaser(chaserDuck, 60)
    } else if (level == 3) {
        tiles.setCurrentTilemap(tilemap`level10`)
        makeLevel()
        makeFruit(30, 8, 1000)
        placeHero(80)
        placeChaser(chaserDuck, 60)
    } else if (level == 4) {
        tiles.setCurrentTilemap(tilemap`level7`)
        makeLevel()
        makeFruit(30, 8, 1500)
        placeHero(80)
        placeChaser(chaserDuck, 60)
    } else {
        game.gameOver(true)
    }
    maze.freeze(true)
    maze.sendEvent("restart", 0)
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
function placeHero (speed: number) {
    maze.setHeroSpeed(speed)
    maze.placeHeroOnImage(assets.tile`tile_hero`)
}
let level = 0
let fruitSpawn = 0
let chaserDuck = 0
let fruitScore = 0
let fruitTime = 0
let fruitSprite: Sprite = null
let chaserBases: tiles.Location[] = []
let pillSprite: Sprite = null
let numPillsEaten = 0
let numPills = 0
let pillScore = 0
setParameters()
makeHero()
makeChasers()
game.splash("Welcome")
nextLevel()
