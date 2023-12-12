//% weight=100 color=#0fbc11 icon="\uf11b" block="Maze"
//% groups=["Hero", "Chaser", "Game", "Events"]
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
        _frozen: boolean

        constructor() {
            this._hero = new Hero()
            this._chasers = []
            this._frozen = false
        }

        init() {
            game.onUpdate(() => getMaze().update())
        }

        reset() {
            this._hero.reset()
            this._chasers.forEach(chaser => chaser.reset())
        }

        restart() {
            this._hero._mover.restart()
            this._chasers.forEach(chaser => chaser._mover.restart())
        }

        update() {
            this._hero.update()
            this._chasers.forEach(chaser => chaser.update())
        }

        freeze(on: boolean) {
            this._frozen = on
            this._hero._mover.freeze(on)
            this._chasers.forEach(chaser => chaser._mover.freeze(on))
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
    //% block="freeze maze $on"
    //% on.defl=true
    //% on.shadow=toggleOnOff
    export function freeze(on: boolean) {
        getMaze().freeze(on)
    }

    //% blockId=maze_is_frozen
    //% group="Game"
    //% block="maze frozen"
    export function isFrozen(): boolean {
        return getMaze()._frozen
    }

    //% blockId=maze_reset
    //% group="Game"
    //% block="reset maze"
    export function reset() {
        getMaze().reset()
    }

    //% blockId=maze_restart
    //% group="Game"
    //% block="restart maze"
    export function restart() {
        getMaze().restart()
    }
}
