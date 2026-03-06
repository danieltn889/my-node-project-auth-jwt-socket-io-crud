// Connect to the existing MongoDB database (match the exact case)
mongoose.connect('mongodb://127.0.0.1:27017/bookStore') 
    .then(() => console.log("MongoDB Connected to bookStore"))
    .catch(err => console.log("Connection Error:", err));

// Define a schema
const userSchema = {
    name: String,
    email: String,
    age: Number,
    city: String,
    tag: [String],
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now }
};

// Create a model
const User = mongoose.model('User', userSchema);

// Function to add a new user
async function addUser() {
    try {
        const newUser = await User.create({
            name: "John Doe",
            email: "john.doe@example.com",
            age: 30,
            city: "New York",
            tag: ["developer", "javascript"],
            isActive: true
        });
        console.log("User created:", newUser);
        
        // // Query example
        // const users = await User.find({ isActive: true, age: { $gt: 25 } });
        // console.log("Users found:", users);
        
        // const latestNewUser = await User.findOne().sort({ createdAt: -1 });
        // console.log("Latest user:", latestNewUser);
        
        // const findLastNewUser=await findById(newUser._id);
        // console.log("Find by ID:", findLastNewUser);  
        
        // const users=await User.find().select("name email -_id");
        // console.log("Users with selected fields:", users);
        
        // const deleteUser=await User.findByIdAndDelete(newUser._id);
        // console.log("Deleted user:", deleteUser);
        
        const updatedUser = await User.findByIdAndUpdate(
            newUser._id,
            {
                $set: { age: 31 },                     // update age
                $push: { tag: { $each: ["updated", "javascript", "nodejs"] } } // add multiple tags
            },
            { new: true } // return the updated document
        );

        console.log("Updated user:", updatedUser);
    } catch (err) {
        console.log("Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

// Run the function
addUser();