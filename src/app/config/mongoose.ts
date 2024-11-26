import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connect(`${process.env.MONGO_DB}`)
        console.log("connect db success!")

    }
    catch (error) {
        console.log("connect db failed: ", error)
    }

}
export default connectDB