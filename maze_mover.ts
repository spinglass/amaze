namespace maze {
    export class Mover {
        _sprite: Sprite
        _x: number
        _y: number
        _vx: number
        _vy: number
        _tileX: number
        _tileY: number
        _canMove: number
        _direction: Direction
        _request: Direction
        _speed: number
        _show: boolean
        _frozen: boolean
        _changedTile: boolean
        _startLocation: tiles.Location

        constructor() {
            this._x = 0         // world x
            this._y = 0         // world y
            this._vx = 0
            this._vy = 0
            this._tileX = 0        // tilemap x
            this._tileY = 0        // tilemap y
            this._canMove = 0
            this._direction = Direction.None
            this._request = Direction.None
            this._speed = 50
            this._show = false
            this._frozen = false
            this._changedTile = false
        }

        create(img: Image, kind: number) {
            this.reset()
            
            this._sprite = sprites.create(img, kind)
            this._x = this._sprite.x
            this._y = this._sprite.y
            this._vx = this._sprite.vx
            this._vy = this._sprite.vy

            // Hide until placed
            this.show(false)
        }

        reset() {
            this.show(false)
        }

        restart() {
            if (this._show) {
                this.placeOnTile(this._startLocation)
            }
        }

        placeOnImage(img: Image) {
            const loc = tiles.getRandomTileByType(img)
            this.placeOnTile(loc)
        }

        placeOnTile(loc: tiles.Location) {
            if (loc) {
                tiles.placeOnTile(this._sprite, loc)
                this._startLocation = loc
                this._sprite.vx = 0
                this._sprite.vy = 0
                this._x = this._sprite.x
                this._y = this._sprite.y
                this._vx = 0
                this._vy = 0
                this._tileX = loc.col
                this._tileY = loc.row
                this._direction = Direction.None
                this._request = Direction.None
                this._changedTile = false
                this.updateCanMove()
                this.show(true)
            }
        }

        show(on: boolean) {
            this._show = on
            if (this._sprite) {
                this._sprite.setFlag(SpriteFlag.Ghost, !on)
                this._sprite.setFlag(SpriteFlag.Invisible, !on)
            }
        }

        request(req: Direction) {
            this._request = req
        }

        update() {
            if (!this.isReady()) {
                return
            }

            const loc = this._sprite.tilemapLocation()
            if (!loc) {
                return
            }

            const tx = loc.col
            const ty = loc.row
            this._changedTile = (this._tileX != tx) || (this._tileY != ty)
            this._tileX = tx
            this._tileY = ty
            this.updateCanMove()

            // Ignore if request is same as current direction
            if (this._request == this._direction) {
                this._request = Direction.None
            }

            const stopped = (this._sprite.vx == 0 && this._sprite.vy == 0)

            let crossing = false
            const cx = loc.x
            const cy = loc.y
            if (!stopped) {
                // Check for crossing centre of tile
                if (this._direction == Direction.Up) {
                    crossing = (this._y > cy && cy >= this._sprite.y)
                } else if (this._direction == Direction.Down) {
                    crossing = (this._y < cy && cy <= this._sprite.y)
                } else if (this._direction == Direction.Left) {
                    crossing = (this._x > cx && cx >= this._sprite.x)
                } else if (this._direction == Direction.Right) {
                    crossing = (this._x < cx && cx <= this._sprite.x)
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
                    this._sprite.x = cx
                    this._sprite.y = cy
                    break
                case Direction.Up:
                    this._sprite.vx = 0
                    this._sprite.vy = -this._speed
                    this._sprite.x = cx
                    break
                case Direction.Down:
                    this._sprite.vx = 0
                    this._sprite.vy = this._speed
                    this._sprite.x = cx
                    break
                case Direction.Left:
                    this._sprite.vx = -this._speed
                    this._sprite.vy = 0
                    this._sprite.y = cy
                    break
                case Direction.Right:
                    this._sprite.vx = this._speed
                    this._sprite.vy = 0
                    this._sprite.y = cy
                    break
            }

            this._x = this._sprite.x
            this._y = this._sprite.y
            this._vx = this._sprite.vx
            this._vy = this._sprite.vy
        }

        freeze(on: boolean) {
            if (this._sprite) {
                if (on) {
                    this._vx = this._sprite.vx
                    this._vy = this._sprite.vy
                    this._sprite.vx = 0
                    this._sprite.vy = 0
                } else {
                    this._sprite.vx = this._vx
                    this._sprite.vy = this._vy
                }
            }
            this._frozen = on
        }

        isReady() : boolean {
            return (this._sprite && this._show && !this._frozen)
        }

        public canMove(dir: Direction): boolean {
            return (this._canMove & dir) != 0
        }
        
        private updateCanMove() {
            this._canMove = 0
            this.checkTile(this._tileX, this._tileY - 1, Direction.Up)
            this.checkTile(this._tileX + 1, this._tileY, Direction.Right)
            this.checkTile(this._tileX, this._tileY + 1, Direction.Down)
            this.checkTile(this._tileX - 1, this._tileY, Direction.Left)
        }

        private checkTile(tx: number, ty: number, dir: Direction) {
            const loc = tiles.getTileLocation(tx, ty)
            if (loc && !loc.isWall()) {
                this._canMove |= dir
            }
        }
    }
}
