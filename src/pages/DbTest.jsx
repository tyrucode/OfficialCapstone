
import mongoose from 'mongoose';
const dotenv = require(['dotenv'])

//load enviornmental variables from .env
dotenv.config();

console.log('Database URI:', DB);

const uri = process.env.MONGODB_URI;

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
            <button onClick={connectToDb()}>click</button>
        </div>
    )
}

export default DbTest