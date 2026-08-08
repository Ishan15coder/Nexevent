const express= require('express');
const dotenv= require('dotenv');
const cors= require('cors');
const mongoose=require('mongoose')
dotenv.config();
const authRoutes= require('./routes/auth')
const eventsRoutes= require('./routes/events')
const bookingsRoutes= require('./routes/bookings')
console.log(authRoutes);
const app = express();

app.use(express.json());

app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/events',eventsRoutes);
app.use('/api/bookings',bookingsRoutes);
mongoose. connect(process.env.MONGODB_URI)

.then(() => {
console.log('Connected to MongoDB');
})
.catch((error) => {
console.error('Error connecting to MongoDB:', error);
})



const PORT= process.env.PORT||5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})