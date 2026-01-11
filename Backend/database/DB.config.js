import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

// ( async () => {

//     try {
//        const connectionistance = await mongoose.connect(`${process.env.MONGODB_URL}/${DBname}`);
//         console.log(`Database connected successfully!!! ${connectionistance.connection.host}`);
        
//     } catch (error) {
//         console.log("Error while connecting to the database!!!", error);
//     }
    
// })()



const connectDB = async () => {
    try {
        const connectionistance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
       
         console.log(`Database connected successfully!!!  ${connectionistance.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to the database!!!", error);
    }
};

export default connectDB;