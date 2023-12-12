namespace maze {
    export class Hero {      
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

            // Get input
            if (controller.up.isPressed()) {
                this._mover.request(Direction.Up)
            } else if (controller.down.isPressed()) {
                this._mover.request(Direction.Down)
            } else if (controller.left.isPressed()) {
                this._mover.request(Direction.Left)
            } else if (controller.right.isPressed()) {
                this._mover.request(Direction.Right)
            }

            this._mover.update()
        }
    }

    //% blockId=maze_hero_create
    //% group="Hero"
    //% block="set hero image to %img=screen_image_picker"
    export function createHero(img: Image) {
        getMaze()._hero._mover.create(img, SpriteKind.Player)
    }

    //% blockId=maze_hero_place_on_image
    //% group="Hero"
    //% block="place hero on random $img"
    //% img.shadow=tileset_tile_picker
    export function placeHeroOnImage(img: Image) {
        getMaze()._hero._mover.placeOnImage(img)
    }

    //% blockId=maze_hero_place_on_tile
    //% group="Hero"
    //% block="place hero on $loc"
    //% loc.shadow=mapgettile
    export function placeHeroOnTile(loc: tiles.Location) {
        getMaze()._hero._mover.placeOnTile(loc)
    }

    //% blockId=maze_hero_camera_follow
    //% group="Hero"
    //% block="camera follow hero"
    export function cameraFollowHero() {
        scene.cameraFollowSprite(getMaze()._hero._mover._sprite)
    }

    //% blockId=maze_hero_set_speed
    //% group="Hero"
    //% block="set hero speed to $speed"
    //% speed.defl=50
    export function setHeroSpeed(speed: number) {
        getMaze()._hero._mover._speed = speed
    }
}