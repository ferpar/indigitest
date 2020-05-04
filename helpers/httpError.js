function makeHttpError ({ statusCode, errorMessage }) {
  return {
    headers: {
      'Content-Type': 'appliction/json'
    },
    statusCode,
    data: JSON.stringify({
      success: false,
      error: errorMessage
    })

  }
}

module.exports = makeHttpError
