namespace maze {
    export enum ChaserKind {
        FollowHero
    }

    export enum ChaserMode {
        Scatter,
        Chase,
    }

    export enum ChaserScatterTarget {
        TopLeft,
        TopRight,
        BottomLeft,
        BottomRight,
    }

    export class Chaser {
        _mover: Mover

        constructor() {
            this._mover = new Mover()
        }

        reset() {
            this._mover.reset()
        }

        update() {
            if (!this._mover.isReady()) {
                return
            }
            
            this._mover.update()
        }
    }

    //% blockId=maze_chaser_create
    //% group="Chasers"
    //% block="create chaser with image %img=screen_image_picker"
    //% blockSetVariable=myChaser
    export function createChaser(img: Image): Chaser {
        const chaser = new Chaser()
        chaser._mover.create(img, SpriteKind.Chaser)
        getMaze()._chasers.push(chaser)
        return chaser
    }
}
