const moongse = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/Ecommers";
main()
.then(()=>{
    console.log("Conneted to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await moongse.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"66483ac7a996ddac6b918f19"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initilized");
}
initDB();