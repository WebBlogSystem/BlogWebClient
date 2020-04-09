export var sstorage = {
  setItem (k, v) {
    sessionStorage.setItem(k, v)
  },
  getItem (k) {
    return sessionStorage.getItem(k)
  }
}
export var lstorage = {
  setItem (k, v) {
    localStorage.setItem(k, v)
  },
  getItem (k) {
    return localStorage.getItem(k)
  }
}
