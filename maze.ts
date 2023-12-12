//% weight=100 color=#0fbc11 icon="\uf11b" block="Maze"
//% groups=["Hero", "Events"]
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
    }
    let _maze: Maze = null

    export function getMaze(): Maze {
        if (!_maze) {
            _maze = new Maze()
            _maze.init()
        }
        return _maze
    }
}
