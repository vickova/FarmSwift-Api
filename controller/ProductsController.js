import Products from "../model/Products.js"
// create new tour
export const createProduct =  async (req, res)=>{
    const newTour = new Products(req.body)

    try {
        const savedTour = await newTour.save()
        res.status(200).json({success:true, message:'Successfully created', data:savedTour})
    } catch (err) {
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}

// update tour
export const updateProduct = async (req, res)=>{

    const id = req.params.id
    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set:req.body
        }, {new:true});
        res.status(200).json({success:true, message:'Successfully updated', data:updatedTour})
    } catch (err) {
        res.status(500).json({success:false, message:'Failed to update. Try again'})
    }
}
// delete tour
export const deleteProduct = async (req, res)=>{
    const id = req.params.id
    try {
        await Tour.findByIdAndDelete(id);
        res.status(200).json({success:true, message:'Successfully deleted'})
    } catch (err) {
        res.status(500).json({success:false, message:'Failed to delete. Try again'})
    }
}
// getSingle tour
export const getSingleProduct = async (req, res)=>{
    const id = req.params.id
    try {
        const tour = await Tour.findById(id).populate('reviews');
        res.status(200).json({success:true, message:'Successfully deleted', data:tour})
    } catch (err) {
        res.status(500).json({success:false, message:'not found'})
    }
}
// getAll tour
export const getAllProducts = async (req, res)=>{
    // for pagination
    const page = parseInt(req.query.page);
    console.log(page)
    try {
        const tours = await Tour.find({}).populate('reviews').skip(page*8).limit(8)
        res.status(200).json({success:true,count:tours.length, message:'Successful', data:tours})
    } catch (err) {
        res.status(404).json({success:false, message:'not found'})
    }

}

// get tour by search
export const getProductBySearch = async(req, res)=>{
    // here 'i' means case sensitive
    const city = new RegExp(req.query.city, 'i');
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);
    try {

        // gte means greater than equal i.e selects the documents where the value of the specified field is greater than or equal to
        // { $set: { "price": 9.99 } : The following example sets the price field based on a 
        // $gte
        const tours = await Tour.find({city, distance:{$gte:distance}, maxGroupSize:{$gte:maxGroupSize}}).populate('reviews')

        res.status(200).json({success:true,count:tours.length, message:'Successful', data:tours})
    } catch (err) {
        res.status(500).json({success:false, message:'not found'})
    }
}