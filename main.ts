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
    if (!(maze.isFrozen()) && !(immortal)) {
        maze.freeze(true)
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        info.changeLifeBy(-1)
        maze.sendEvent("restart", 1)
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (skipLevel) {
        nextLevel()
    }
})
function makeLevel () {
    locsHero = maze.findAndClearLocations(assets.tile`tile_hero`)
    locsPill = maze.findAndClearLocations(assets.tile`tile_pill`)
    locsChaser = maze.findAndClearLocations(assets.tile`tile_chaser`)
    locsFruit = maze.findAndClearLocations(assets.tile`tile_fruit`)
    numPillsEaten = 0
    numPills = locsPill.length
    for (let value of locsPill) {
        pillSprite = sprites.create(assets.image`sprite_pill`, SpriteKind.Pill)
        tiles.placeOnTile(pillSprite, value)
    }
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
    tiles.placeOnTile(fruitSprite, locsFruit[0])
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
    maze.setChaserKind(chaserDuck, maze.ChaserKind.Random)
    chaserMonkey = maze.createChaser(img`
        . . . . f f f f f . . . . . . . 
        . . . f e e e e e f . . . . . . 
        . . f d d d d e e e f . . . . . 
        . c d f d d f d e e f f . . . . 
        . c d f d d f d e e d d f . . . 
        c d e e d d d d e e b d c . . . 
        c d d d d c d d e e b d c . f f 
        c c c c c d d d e e f c . f e f 
        . f d d d d d e e f f . . f e f 
        . . f f f f f e e e e f . f e f 
        . . . . f e e e e e e e f f e f 
        . . . f e f f e f e e e e f f . 
        . . . f e f f e f e e e e f . . 
        . . . f d b f d b f f e f . . . 
        . . . f d d c d d b b d f . . . 
        . . . . f f f f f f f f f . . . 
        `)
    maze.setChaserKind(chaserMonkey, maze.ChaserKind.FollowHero)
}
function placeChaser (id: number, speed: number) {
    if (locsChaser.length > 0) {
        maze.placeChaser(id, locsChaser.shift())
        maze.setChaserSpeed(id, speed)
    }
}
function cleanup () {
    maze.reset()
    maze.cancelAllEvents()
    sprites.destroy(fruitSprite)
    for (let value22 of sprites.allOfKind(SpriteKind.Pill)) {
        sprites.destroy(value22)
    }
}
function makeFruit (spawn: number, time: number, score: number) {
    fruitSpawn = spawn
    fruitTime = time
    fruitScore = score
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
        game.splash("Ducks are random")
        tiles.setCurrentTilemap(tilemap`level1`)
        makeLevel()
        makeFruit(20, 5, 500)
        placeHero(80)
        placeChaser(chaserDuck, 60)
    } else if (level == 3) {
        game.splash("Monkeys chase you")
        tiles.setCurrentTilemap(tilemap`level1`)
        makeLevel()
        makeFruit(20, 5, 500)
        placeHero(80)
        placeChaser(chaserMonkey, 60)
    } else if (level == 4) {
        tiles.setCurrentTilemap(tilemap`level10`)
        makeLevel()
        makeFruit(30, 8, 1000)
        placeHero(80)
        placeChaser(chaserDuck, 60)
    } else if (level == 5) {
        tiles.setCurrentTilemap(tilemap`level7`)
        makeLevel()
        makeFruit(30, 8, 1500)
        placeHero(80)
        placeChaser(chaserMonkey, 60)
    } else if (level == 6) {
        game.splash("They can gang-up")
        tiles.setCurrentTilemap(tilemap`level10`)
        makeLevel()
        makeFruit(30, 8, 1000)
        placeHero(80)
        placeChaser(chaserDuck, 60)
        placeChaser(chaserMonkey, 60)
    } else if (level == 7) {
        tiles.setCurrentTilemap(tilemap`level7`)
        makeLevel()
        makeFruit(30, 8, 1500)
        placeHero(80)
        placeChaser(chaserDuck, 60)
        placeChaser(chaserMonkey, 60)
    } else {
        game.gameOver(true)
    }
    maze.freeze(true)
    maze.sendEvent("restart", 0)
}
function setCheats () {
    skipLevel = true
    immortal = true
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
    maze.placeHeroOnTile(locsHero[0])
}
let level = 0
let fruitSpawn = 0
let chaserMonkey = 0
let chaserDuck = 0
let fruitScore = 0
let fruitTime = 0
let fruitSprite: Sprite = null
let pillSprite: Sprite = null
let numPills = 0
let numPillsEaten = 0
let locsFruit: tiles.Location[] = []
let locsChaser: tiles.Location[] = []
let locsPill: tiles.Location[] = []
let locsHero: tiles.Location[] = []
let skipLevel = false
let immortal = false
let pillScore = 0
setParameters()
makeHero()
makeChasers()
game.splash("Amaze!")
nextLevel()
