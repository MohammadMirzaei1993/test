const { productModel } = require('../model/productModel');
const { addProductShema } = require('../validation/addProduct');


const addproduct = async (req, res, next) => {
    try {
        await addProductShema.validate(req.body, { abortEarly: false })
        const result = await productModel.create(req.body)
        console.log(result)
        res.status(201).json({ message: "محصول ساخته شد", sataus: 201, success: true })
    } catch (error) {
        next({
            status: 400,
            message: error.errors || error.message
        })

    }
}


const getProducts = async (req, res, next) => {
    try {
        const products = await productModel.find({})
        if (!products.length) {
            throw ({ success: false, message: "محصولی برای نمایش وجود ندارد" })
        }
        res.status(200).json(products)

    } catch (error) {
        next({
            status: 400,
            message: error.message
        })

    }
}
const getOneProduct = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await productModel.findOne({ _id: id })

        if (!product) {
            throw ({ message: "محصولی یافت نشد", success: false })
        }
        res.status(200).json(product)


    } catch (error) {
        next({ message: error.message, status: 400 })
    }

}


const editProduct = async (req, res, next) => {
    try {

        for (const key in req.body) {
            if (["name", "description", "category", "store", "rating", "countAvalibale", "price"].includes(key)) {
                throw { success: false, message: "عملیات ناموفق" }
            }
        }

        const id = req.params.id
        const result = await productModel.updateOne({ _id: id }, req.body)
        res.status(200).json({ message: "محصول تغییر کرد", success: true })




    } catch (error) {

        next({ message: error.message, status: 400 })
    }




}
const searchProduct = async (req, res, next) => {
    try {
        const query = req.query
        const result = await productModel.find(query)
        res.json(result)

    } catch (error) {
        next({ message: error.message, status: 400 })


    }
}


const deleteProduct =async (req,res,next)=>{
    try {
        const id  = req.params.id
        await productModel.deleteOne({_id:id})
        res.json({message:"محصول با موفقیت پاک شد"})
        
    } catch (error) {
        next({ message: error.message, status: 400 })
        
    }
}

module.exports = { getProducts, addproduct, getOneProduct, searchProduct, editProduct,deleteProduct }