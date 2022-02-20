class TypedError {
  constructor (type, detail = null) {
    this.type = type
    this.detail = detail
  }
}

export default TypedError