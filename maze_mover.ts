namespace maze {
    export class Mover {
        _sprite: Sprite
        _loc: tiles.Location
        _x: number
        _y: number
        _vx: number
        _vy: number
        _tx: number
        _ty: number
        _direction: Direction
        _request: Direction
        _speed: number
        _freeze: boolean

        constructor() {
            this._x = 0
            this._y = 0
            this._vx = 0
            this._vy = 0
            this._tx = 0
            this._ty = 0
            this._direction = Direction.None
            this._request = Direction.None
            this._speed = 50
            this._freeze = false
        }

        create(img: Image, kind: number) {
            if (this._sprite) {
                this._sprite.destroy()
            }
            this._sprite = sprites.create(img, kind)
            this._loc = this._sprite.tilemapLocation()
            this._x = this._sprite.x
            this._y = this._sprite.y
            this._vx = this._sprite.vx
            this._vy = this._sprite.vy
            this._tx = this._loc.col
            this._ty = this._loc.row
        }

        place(img: Image) {
            const loc = tiles.getRandomTileByType(img)
            tiles.placeOnTile(this._sprite, loc)
            this._sprite.vx = 0
            this._sprite.vy = 0
            this._loc = loc
            this._x = this._sprite.x
            this._y = this._sprite.y
            this._vx = 0
            this._vy = 0
            this._tx = loc.col
            this._ty = loc.row
            this._direction = Direction.None
        }

        request(req: Direction) {
            this._request = req
        }

        update() {
            if (!this.isReady()) {
                return
            }

            this._loc = this._sprite.tilemapLocation()
            if (!this._loc) {
                return
            }
            const tx = this._loc.x
            const ty = this._loc.y

            // Ignore if request is same as current direction
            if (this._request == this._direction) {
                this._request = Direction.None
            }

            // Check for crossing centre of tile
            const stopped = (this._sprite.vx == 0 && this._sprite.vy == 0)
            let crossing = false
            if (!stopped) {
                if (this._direction == Direction.Up) {
                    crossing = (this._y > ty && ty >= this._sprite.y)
                } else if (this._direction == Direction.Down) {
                    crossing = (this._y < ty && ty <= this._sprite.y)
                } else if (this._direction == Direction.Left) {
                    crossing = (this._x > tx && tx >= this._sprite.x)
                } else if (this._direction == Direction.Right) {
                    crossing = (this._x < tx && tx <= this._sprite.x)
                }
            }

            if (this._direction != Direction.None) {
                // Can reverse direction at any time
                if (this._direction == opposite(this._request)) {
                    this._direction = this._request
                    this._request = Direction.None
                }
                // Stop current direction if reached tile centre and can't continue
                else if ((stopped || crossing) && !this.canMove(this._direction)) {
                    this._direction = Direction.None
                }
            }

            // Apply requested direction if it's possible
            if ((stopped || crossing) && this.canMove(this._request)) {
                this._direction = this._request
                this._request = Direction.None
            }

            switch (this._direction) {
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
            this._tx = tx
            this._ty = ty
        }

        freeze(enable: boolean) {
            if (this._sprite) {
                if (enable) {
                    this._vx = this._sprite.vx
                    this._vy = this._sprite.vy
                    this._sprite.vx = 0
                    this._sprite.vy = 0
                } else {
                    this._sprite.vx = this._vx
                    this._sprite.vy = this._vy
                }
            }
            this._freeze = enable
        }

        isReady() : boolean {
            return (this._sprite && !this._freeze)
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
}
