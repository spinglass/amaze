//% weight=100 color=#0fbc11 icon="\uf11b" block="Maze"
//% groups=["Hero", "Chasers", "Game", "Events"]
namespace maze {
    export enum Direction {
        None = 0,
        Up = 1 << 0,
        Right = 1 << 1,
        Down = 1 << 2,
        Left = 1 << 3,
    }

    export function opposite(dir: Direction): Direction {
        return (dir << 2) % 0xf
    }

    class Maze {
        _hero: Hero
        _chasers: Chaser[]

        constructor() {
            this._hero = new Hero()
            this._chasers = []
        }

        init() {
            game.onUpdate(() => getMaze().update())
        }

        reset() {
            this._hero.reset()
            this._chasers.forEach(chaser => chaser.reset())
        }

        update() {
            this._hero.update()
            this._chasers.forEach(chaser => chaser.update())
        }

        freeze(enable: boolean) {
            this._hero._mover.freeze(enable)
            this._chasers.forEach(chaser => chaser._mover.freeze(enable))
        }
    }
    let _maze: Maze = null

    export function getMaze(): Maze {
        if (!_maze) {
            _maze = new Maze()
            _maze.init()
        }
        return _maze
    }

    //% blockId=maze_freeze
    //% group="Game"
    //% block="freeze maze $enable"
    //% enable.defl=true
    //% enable.shadow=toggleOnOff
    export function freeze(enable: boolean) {
        getMaze().freeze(enable)
    }

    //% blockId=maze_reset
    //% group="Game"
    //% block="reset maze"
    export function reset() {
        getMaze().reset()
    }
}
