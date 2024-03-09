import mongoose from 'mongoose'
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    // The slug field in used to store a URL-friendly version of the category name
    slug:{
        type:String,
        // Converts the value of the slug field to lowercase
        lowercase:true
    }
})
export default mongoose.model('Category',categorySchema)