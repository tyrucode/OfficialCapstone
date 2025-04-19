import dotenv from 'dotenv';
const mongoose = require('mongoose');

//load enviornmental variables from .env
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

function DbTest() {


    const connectToDb = async function () {
        if (!uri) {
            console.error('MONGODB_URI is not defined in environment variables');
            return;
        }

        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }

    }


    return (
        <div>
            <h1>db test</h1>
            <b onClick={connectToDb()}>click</b>
        </div>
    )
}

export default DbTest