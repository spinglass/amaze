//% weight=100 color=#0fbc11 icon="\uf11b" block="Maze"
//% groups=["Hero", "Game", "Events"]
namespace maze {

    class Maze {
        _hero: Hero

        constructor() {
            this._hero = new Hero()
        }

        init() {
            game.onUpdate(() => getMaze().update())
        }

        update() {
            this._hero.update()
        }

        freeze(enable: boolean) {
            this._hero.freeze(enable)
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
    //% block="freeze $enable"
    //% enable.defl=true
    //% enable.shadow=toggleOnOff
    export function freeze(enable: boolean) {
        getMaze().freeze(enable)
    }
}
