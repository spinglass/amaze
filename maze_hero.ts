namespace maze {
    enum Direction {
        None,
        Up,
        Down,
        Left,
        Right,
    }

    function opposite(dir: Direction): Direction {
        if (dir == Direction.Up) {
            return Direction.Down
        }
        if (dir == Direction.Down) {
            return Direction.Up
        }
        if (dir == Direction.Left) {
            return Direction.Right
        }
        if (dir == Direction.Right) {
            return Direction.Left
        }
        return Direction.None
    }

    export class Hero {       
        _sprite: Sprite
        _loc: tiles.Location
        _speed: number
        _x: number
        _y: number
        _vx: number
        _vy: number
        _current: Direction
        _request: Direction
        _freeze: boolean

        constructor() {
            this._speed = 50
            this._x = 0
            this._y = 0
            this._current = Direction.None
            this._request = Direction.None
        }

        create(img: Image) {
            if (this._sprite) {
                this._sprite.destroy()
            }
            this._sprite = sprites.create(img, SpriteKind.Player);
        }

        place(img: Image) {
            const loc = tiles.getRandomTileByType(img)
            tiles.placeOnTile(this._sprite, loc)
            this._sprite.vx = 0
            this._sprite.vy = 0
            this._loc = loc
            this._x = this._sprite.x
            this._y = this._sprite.y
            this._current = Direction.None
        }

        update() {
            if (!this._sprite || this._freeze) {
                return
            }

            this._loc = this._sprite.tilemapLocation()
            if (!this._loc) {
                return
            }
            const tx = this._loc.x
            const ty = this._loc.y
            
            // Get input
            if (controller.up.isPressed()) {
                this._request = Direction.Up
            } else if (controller.down.isPressed()) {
                this._request = Direction.Down
            } else if (controller.left.isPressed()) {
                this._request = Direction.Left
            } else if (controller.right.isPressed()) {
                this._request = Direction.Right
            }

            // Ignore if request is same as current direction
            if (this._request == this._current) {
                this._request = Direction.None
            }

            // Check for crossing centre of tile
            const stopped = (this._sprite.vx == 0 && this._sprite.vy == 0)
            let crossing = false
            if (!stopped) {
                if (this._current == Direction.Up) {
                    crossing = (this._y > ty && ty >= this._sprite.y)
                } else if (this._current == Direction.Down) {
                    crossing = (this._y < ty && ty <= this._sprite.y)
                } else if (this._current == Direction.Left) {
                    crossing = (this._x > tx && tx >= this._sprite.x)
                } else if (this._current == Direction.Right) {
                    crossing = (this._x < tx && tx <= this._sprite.x)
                }
            }

            if (this._current != Direction.None) {
                // Can reverse direction at any time
                if (this._current == opposite(this._request)) {
                    this._current = this._request
                    this._request = Direction.None
                }
                // Stop current direction if reached tile centre and can't continue
                else if ((stopped || crossing) && !this.canMove(this._current)) {
                    this._current = Direction.None
                }
            }

            // Apply requested direction if it's possible
            if ((stopped || crossing) && this.canMove(this._request)) {
                this._current = this._request
                this._request = Direction.None
            }

            switch (this._current) {
                case Direction.None:
                    this._sprite.vx = 0
                    this._sprite.vy = 0
                    this._sprite.x = this._loc.x
                    this._sprite.y = this._loc.y
                    break
                case Direction.Up:
                    this._sprite.vx = 0
                    this._sprite.vy = -this._speed
                    this._sprite.x = this._loc.x
                    break
                case Direction.Down:
                    this._sprite.vx = 0
                    this._sprite.vy = this._speed
                    this._sprite.x = this._loc.x
                    break
                case Direction.Left:
                    this._sprite.vx = -this._speed
                    this._sprite.vy = 0
                    this._sprite.y = this._loc.y
                    break
                case Direction.Right:
                    this._sprite.vx = this._speed
                    this._sprite.vy = 0
                    this._sprite.y = this._loc.y
                    break
            }

            this._x = this._sprite.x
            this._y = this._sprite.y
            this._vx = this._sprite.vx
            this._vy = this._sprite.vy
        }

        freeze(enable: boolean) {
            if (this._sprite) {
                if (enable) {
                    this._vx = this._sprite.vx
                    this._vy = this._sprite.vy
                    this._sprite.vx = 0
                    this._sprite.vy =0
                } else {
                    this._sprite.vx = this._vx
                    this._sprite.vy = this._vy
                }
            }
            this._freeze = enable
        }

        private canMove(dir: Direction): boolean { 
            if (dir == Direction.None) {
                return false
            }
            let colDir
            switch (dir) {
                case Direction.Up:
                    colDir = CollisionDirection.Top
                    break
                case Direction.Down:
                    colDir = CollisionDirection.Bottom
                    break
                case Direction.Left:
                    colDir = CollisionDirection.Left
                    break
                case Direction.Right:
                    colDir = CollisionDirection.Right
                    break
            }
            const neighbor = this._loc.getNeighboringLocation(colDir)
            if (neighbor) {
                return !neighbor.isWall()
            }
            return true
        }
    }

    //% blockId=maze_hero_create
    //% group="Hero"
    //% block="set hero image to %img=screen_image_picker"
    export function createHero(img: Image) {
        getMaze()._hero.create(img)
    }

    //% blockId=maze_hero_place
    //% group="Hero"
    //% block="place hero on tile %img=tileset_tile_picker"
    export function placeHero(img: Image) {
        getMaze()._hero.place(img)
    }

    //% blockId=maze_hero_camera_follow
    //% group="Hero"
    //% block="camera follow hero"
    export function cameraFollowHero() {
        scene.cameraFollowSprite(getMaze()._hero._sprite)
    }

    //% blockId=maze_hero_set_speed
    //% group="Hero"
    //% block="set hero speed to $speed"
    //% speed.defl=50
    export function setHeroSpeed(speed: number) {
        getMaze()._hero._speed = speed
    }
}