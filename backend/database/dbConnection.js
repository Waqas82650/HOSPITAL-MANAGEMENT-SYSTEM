import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"HMS"
    }).then(()=>{
        console.log("Connected to db")
    }).catch((err)=>{
        console.log(`Some error occured while connecting to db: ${err}`)
    })
}