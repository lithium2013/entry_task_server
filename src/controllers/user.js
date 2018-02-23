const userController = function (models) {
  const register = async (request, reply) => {
    console.log('aaaaa')
    console.log(request.body)
    console.log(request.params)
  }

  return {
    register
  }
}

module.exports = userController
