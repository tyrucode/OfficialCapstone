export async function connectToDatabase() {
    if (cached.conn) {
        console.log("Using cached database connection");
        return { db: cached.conn, mongoClient: cached.conn.connection.client };
    }

    if (!cached.promise) {
        console.log("Attempting to connect to MongoDB at:", MONGODB_URI);
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log("MongoDB connection successful!");
                return mongoose;
            })
            .catch(err => {
                console.error("MongoDB connection error:", err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        console.log("Database connection established");
        return { db: cached.conn, mongoClient: cached.conn.connection.client };
    } catch (error) {
        console.error("Failed to establish database connection:", error);
        throw error;
    }
}