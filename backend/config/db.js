import mongoose from 'mongoose'


const connectDB = async () => {
    try {
        //database Name
        const databaseName='Billisea';
        const localdB  = `mongodb://127.0.0.1:27017/${databaseName}`
        const remoteDb  = `mongodb+srv://fsea:fsea@fsea0.agjpp.mongodb.net/${databaseName}?retryWrites=true&w=majority`
        const con = await mongoose.connect(remoteDb, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        console.log(`Database connected : ${con.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB