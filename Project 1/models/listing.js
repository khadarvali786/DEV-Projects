const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description : String,
    image:{
        filename:String,
        url:String,
        // type:String,
        // default:"https://images.unsplash.com/photo-1710115929211-ae9646071f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8",
        // set:(v)=>
        //     v===""
        //     ? "https://images.unsplash.com/photo-1710115929211-ae9646071f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
        //     : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews :[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry :{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
        }
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;