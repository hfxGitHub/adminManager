const SessionStorageHandler = function () {
}
SessionStorageHandler.prototype = {
    getSessionObject () {
        return window.sessionStorage
    },
    getSessionByKey (key) {
        return this.getSessionObject().getItem(key)
    },
    setSessionByKey (key, value) {
        this.getSessionObject().setItem(key, value)
    },
    removeSessionByKey (key) {
        this.getSessionObject().removeItem(key)
    },
    clearSession () {
        this.getSessionObject().clear()
    },
};
module.exports = new SessionStorageHandler();
