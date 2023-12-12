namespace maze {
    export enum ChaserKind {
        Random,
        FollowHero
    }

    export enum ChaserMode {
        Scatter,
        Chase,
    }

    export class Chaser {
        _mover: Mover
        _kind: ChaserKind
        _mode: ChaserMode

        constructor() {
            this._mover = new Mover()
            this._kind = ChaserKind.Random
            this._mode = ChaserMode.Chase
        }

        reset() {
            this._mover.reset()
        }

        update() {
            if (!this._mover.isReady()) {
                return
            }

            const m = this._mover
            const stopped = (m._vx == 0 && m._vy == 0)
            if (stopped || m._changedTile) {
                // Select the required behaviour
                if (this._mode = ChaserMode.Scatter) {
                    this.requestScatter()
                } else if (this._mode = ChaserMode.Chase) {
                    if (this._kind == ChaserKind.Random) {
                        this.requestRandom()
                    }
                }
            }
            
            this._mover.update()
        }

        private canMove(dir: Direction): boolean {
            return (this._mover._direction != opposite(dir) && this._mover.canMove(dir))
        }

        private requestScatter() {

        }

        private requestRandom() {
            let dirs: Direction[] = [Direction.Up, Direction.Right, Direction.Down, Direction.Left]
            let options: Direction[] = []

            dirs.forEach(dir => {
                if (this.canMove(dir)) {
                    options.push(dir)
                }
            })

            if (options.length > 0) {
                const r = Math.randomRange(0, options.length - 1)
                this._mover.request(options[r])
            }
        }
    }

    function getChaser(id: number): Chaser {
        return getMaze()._chasers[id]
    }

    //% blockId=maze_chaser_create
    //% group="Chaser"
    //% block="create chaser with image %img=screen_image_picker"
    //% blockSetVariable=myChaserId
    export function createChaser(img: Image): number {
        const maze = getMaze()
        const chaser = new Chaser()
        chaser._mover.create(img, SpriteKind.Chaser)
        const id = maze._chasers.length
        maze._chasers.push(chaser)
        return id
    }


    //% blockId=maze_chaser_place_on_image
    //% group="Chaser"
    //% block="place chaser $id on random $img"
    //% img.shadow=tileset_tile_picker
    export function placeChaserOnImage(id: number, img: Image) {
        const chaser = getChaser(id)
        if (chaser) {
            chaser._mover.placeOnImage(img)
        }
    }

    //% blockId=maze_chaser_place_on_tile
    //% group="Chaser"
    //% block="place chaser $id on $loc"
    //% id.defl=myChaserId
    //% loc.shadow=mapgettile
    export function placeChaser(id: number, loc: tiles.Location) {
        const chaser = getChaser(id)
        if (chaser) {
            chaser._mover.placeOnTile(loc)
        }
    }

    //% blockId=maze_chaser_set_speed
    //% group="Chaser"
    //% block="set chaser $id speed to $speed"
    //% speed.defl=50
    export function setChaserSpeed(id: number, speed: number) {
        const chaser = getChaser(id)
        if (chaser) {
            chaser._mover._speed = speed
        }
    }
}
