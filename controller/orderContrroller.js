


const submitOrder = (req, res, next) => {
    try {

    } catch (error) {
        next({
            status: 400,
            messag: error.errors || error.message

        })
    }
}



const getOneOrder = (req, res, next) => {
    try {

    } catch (error) {
        next({
            status: 400,
            message: error.errors || error.message

        })
    }

}


const getOrders = (req, res, next) => {
    try {

    } catch (error) {
        next({
            status: 400,
            message: error.errors || error.message

        })
    }
}

module.exports ={submitOrder,getOrders,getOneOrder}