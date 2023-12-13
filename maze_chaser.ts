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
        _homeX: number
        _homeY: number
        _targetX: number
        _targetY: number

        constructor() {
            this._mover = new Mover()
            this._kind = ChaserKind.Random
            this._mode = ChaserMode.Chase
            this._homeX = 0
            this._homeY = 0
            this._targetX = 0
            this._targetY = 0
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
                    this.doScatter()
                } else if (this._mode = ChaserMode.Chase) {
                    if (this._kind == ChaserKind.Random) {
                        this.doRandom()
                    } else if (this._kind == ChaserKind.FollowHero) {
                        this.doFollow()
                    }
                }
            }
            
            this._mover.update()
        }

        setHome() {
            this._homeX = this._mover._tileX
            this._homeY = this._mover._tileY
        }

        private canMove(dir: Direction): boolean {
            return (this._mover._direction != opposite(dir) && this._mover.canMove(dir))
        }

        private doScatter() {
            this._targetX = this._homeX
            this._targetY = this._homeY
            this.doTarget()
        }

        private doRandom() {
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

        private doFollow() {
            const hero = getMaze()._hero
            this._targetX = hero._mover._tileX
            this._targetY = hero._mover._tileY
            this.doTarget()
        }

        private doTarget() {
            // Get distance to target in each axis
            const dx = (this._targetX - this._mover._tileX)
            const dy = (this._targetY - this._mover._tileY)

            // Decide prefered direction for each axis
            const dirX = (dx > 0) ? Direction.Right : Direction.Left
            const dirY = (dy > 0) ? Direction.Down : Direction.Up

            let dirs: Direction[]
            if (Math.abs(dx) > Math.abs(dy)) {
                // Want to right direction in x then y
                dirs = [dirX, dirY, opposite(dirY), opposite(dirX)]
            } else {
                // Want to right direction in y then x
                dirs = [dirY, dirX, opposite(dirX), opposite(dirY)]
            }

            // Request the first direction than is allowed
            for (const dir of dirs) {
                if (this.canMove(dir)) {
                    this._mover.request(dir)
                    break
                }
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
            chaser.setHome()
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
            chaser.setHome()
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

    //% blockId=maze_chaser_set_kind
    //% group="Chaser"
    //% block="set chaser $id kind to $kind"
    //% speed.defl=ChaserKind.Random
    export function setChaserKind(id: number, kind: ChaserKind) {
        const chaser = getChaser(id)
        if (chaser) {
            chaser._kind = kind
        }
    }
}
