// States

enum CircuitState {
    CLOSED = 'CLOSED', // Everything is fine, go ahead
    OPEN = 'OPEN', // Too many failures - stop requestes temporarily
    HALF_OPEN = 'HALF_OPEN' // Let a test request to pass to check if service is back
}

class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED
    private failureCount = 0
    private lastFailureTime = 0

    private failureThreshold: number
    private resetTimeout: number

    public statusMessage: string | null = null

    constructor(failureThreshold = 3, resetTimeout = 60 * 1000) {
        this.failureThreshold = failureThreshold
        this.resetTimeout = resetTimeout
        this.updateStatusMessage()
    }

    private updateStatusMessage(){
        switch (this.state) {
            case CircuitState.CLOSED:
                this.statusMessage = 'Circuit is closed.'
                console.log("Service is up and running")
                break;
            case CircuitState.OPEN:
                const secondsLeft = Math.ceil((this.lastFailureTime + this.resetTimeout - Date.now()) / 1000)
                this.statusMessage = `Service is unavailable. Retrying in ${secondsLeft} seconds.`
                console.warn(`Circuit Breaker: ${this.statusMessage}`)
                break;
            case CircuitState.HALF_OPEN:
                this.statusMessage = "Trying to reconnect..."
                console.warn(`Circuit Breaker: ${this.statusMessage}`)
            default:
                break;
        }
    }

    // Check if a request should be sent

    public allowRequest(): boolean {
        if(this.state === CircuitState.OPEN) {
            const now = Date.now()
            if(now - this.lastFailureTime > this.resetTimeout) {
                this.state = CircuitState.HALF_OPEN
                this.updateStatusMessage()
                return true
            }
            // if time diff with last failure time equal or less than resetTimeout return false
            this.updateStatusMessage()
            return false
        }
        return true
    }

    public onSuccess(){
        if(this.state === CircuitState.HALF_OPEN) {
            this.state = CircuitState.CLOSED
            this.updateStatusMessage()
        }
        this.failureCount = 0
    }

    public onFailure(){
        this.failureCount++
        this.lastFailureTime = Date.now()

        if(this.state === CircuitState.HALF_OPEN || (this.state === CircuitState.CLOSED && this.failureCount >= this.failureThreshold)) {
            this.state = CircuitState.OPEN
        }
        this.updateStatusMessage
    }
}

export default CircuitBreaker