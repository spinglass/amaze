namespace maze {
    class Event {
        _name: string
        _time: number
        _fired: boolean

        constructor(name: string) {
            this._name = name
            this._time = 0
            this._fired = false
        }

        public update(time: number): boolean {
            if (!this._fired) {
                if (time >= this._time) {
                    this._fired = true
                    return true
                }
            }
            return false
        }

        public getName(): string { return this._name }

        public setTime(time: number) {
            this._time = time
            this._fired = false
        }

        public cancel() {
            this._fired = true
        }
    }

    class Handler {
        _name: string
        _callback: () => void

        constructor(name: string, callback: () => void) {
            this._name = name
            this._callback = callback
        }

        public call() {
            if (this._callback) {
                this._callback()
            }
        }

        public getName(): string { return this._name }
    }

    class EventManager {
        _events: Event[]
        _handlers: Handler[]
        _time: number

        constructor() {
            this._events = []
            this._handlers = []
            this._time = game.runtime()
        }

        public init() {
            game.onUpdate(function () {
                getEventManager().update()
            })
        }

        private update() {
            this._time = game.runtime()

            this._events.forEach(e => {
                if (e.update(this._time)) {
                    this.sendEvent(e)
                }
            })
        }

        public createHandler(name: string, callback: () => void) {
            const h = new Handler(name, callback)
            this._handlers.push(h)
        }

        public getEvent(name: string): Event {
            // Check for existing event with this name
            const found = this._events.find(e => e._name == name)
            if (found) {
                return found
            }

            // Create new event
            const e = new Event(name)
            this._events.push(e)
            return e
        }

        public sendEvent(e: Event) {
            if (!e) {
                return
            }
            this._handlers.forEach(h => {
                if (e.getName() == h.getName()) {
                    h.call()
                }
            })
            e.cancel()
        }

        public cancelAllEvents() {
            this._events.forEach(e => e.cancel())
        }
    }

    function getEventManager(): EventManager {
        let em = game.currentScene().data.eventManager
        if (!em) {
            em = new EventManager()
            em.init()
            game.currentScene().data.eventManager = em
        }
        return em
    }

    //% blockId=maze_on_event
    //% group="Events"
    //% block="on event $name"
    //% weight=100
    export function onEvent(name: string, callback: () => void) {
        if (name) {
            const em = getEventManager()
            em.createHandler(name, callback)
        }
    }

    //% blockId=maze_send_event
    //% group="Events"
    //% block="send event $name in $delay seconds"
    //% delay.dfl = 10
    //% weight=90
    export function sendEvent(name: string, delay: number) {
        if (name) {
            const em = getEventManager()
            const e = em.getEvent(name)
            e.setTime(em._time + 1000 * delay)
        }
    }

    //% blockId=maze_cancel_event
    //% group="Events"
    //% block="cancel event $name"
    //% weight=40
    export function cancelEvent(name: string) {
        if (name) {
            const em = getEventManager()
            const e = em.getEvent(name)
            e.cancel()
        }
    }

    //% blockId=maze_cancel_all_events
    //% group="Events"
    //% block="cancel all events"
    //% weight=50
    export function cancelAllEvents() {
        const em = getEventManager()
        em.cancelAllEvents()
    }
}
