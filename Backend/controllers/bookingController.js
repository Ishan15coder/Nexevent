const Booking=require('../models/Bookings');
const OTP=require('../models/OTP');
const Event=require('../models/Event');
const { sendOTPEmail,sendBookingEmail} = require('../utils/email');

const generateOTP=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString()
}

exports.sendBookingOtp=async(req,res)=>{
    const {eventId}= req.body;
    const userEmail = req.user.email;
    const otp= generateOTP();
    await OTP.findOneAndDelete({email:userEmail,action:'event_booking'});
    await OTP.create({email:userEmail,otp,action:'event_booking'});
    await sendOTPEmail(userEmail,otp,'event_booking');
    res.json({message:'OTP sent to your email'});
}

exports.bookEvent=async(req,res)=>{
    const {eventId,otp}= req.body;
    const userEmail=req.user.email;
    const otpRecord= await OTP.findOne({email:userEmail,otp,action:'event_booking'});
    if(!otpRecord){
        return res.status(400).json({message:'Invalid OTP'});
    }
    const event= await Event.findById(eventId);
    if(!event){
        return res.status(404).json({message:'Event not found'});
    }
    if(event.availableSeats<=0){
        return res.status(400).json({message:'No available seats for this event'});
    }

    const existingBooking= await Booking.findOne({userId:req.user._id,eventId});
    if(existingBooking){
        return res.status(400).json({message:'You have already booked this event'});
    }

    const booking= await Booking.create({
        userId:req.user._id,
        eventId,
        amount:event.ticketPrice,
        paymentStatus:'not_paid',
        status:'pending'
    });

    await OTP.deleteMany({email:userEmail,action:'event_booking'}); 
    try{
        await sendBookingEmail(userEmail,event.title,booking._id);
    } catch(e){ console.error('Email send error:',e.message); }
    res.status(201).json({message:'Booking created successfully',booking});
}

exports.confirmBooking=async(req,res)=>{
    const paymentStatus=req.body.paymentStatus;
    if(!['paid','not_paid'].includes(paymentStatus)){
        return res.status(400).json({message:'Invalid payment status'});
    }
    const booking= await Booking.findById(req.params.id).populate('eventId').populate('userId','name email');
    if(!booking){
        return res.status(404).json({message:'Booking not found'});
    }
    if(booking.status==='confirmed'){
        return res.status(400).json({message:'Booking is already confirmed'});
    }

    const event= await Event.findById(booking.eventId);
    if(!event){
        return res.status(404).json({message:'Event not found'});
    }
    if(event.availableSeats<=0){
        return res.status(400).json({message:'No available seats for this event'});
    }

    booking.status='confirmed';
    booking.paymentStatus=paymentStatus;
    await booking.save();
    event.availableSeats-=1;
    await event.save();
    try{
        await sendBookingEmail(booking.userId.email,event.title,booking._id);
    } catch(e){ console.error('Email send error:',e.message); }
    res.json({message:'Booking confirmed successfully',booking});
}

exports.getMyBookings=async(req,res)=>{
    const bookings= await Booking.find({userId:req.user._id}).populate('eventId');
    res.json(bookings);
}

exports.getAllBookings=async(req,res)=>{
    try{
        const bookings= await Booking.find({}).populate('eventId','title date location').populate('userId','name email');
        res.json(bookings);
    } catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.cancelBooking=async(req,res)=>{
    const booking= await Booking.findById(req.params.id);
    if(!booking){
        return res.status(404).json({message:'Booking not found'});
    }   
    if(booking.userId.toString()!==req.user._id.toString() && req.user.role !== 'admin'){
        return res.status(403).json({message:'You are not authorized to cancel this booking'});
    }
    if(booking.status==='cancelled'){
        return res.status(400).json({message:'Booking is already cancelled'});
    }
    if(booking.status==='confirmed'){
        const event= await Event.findById(booking.eventId);
        if(event){
            event.availableSeats+=1;
            await event.save();
        }
    }
    booking.status='cancelled';
    await booking.save();
    res.json({message:'Booking cancelled successfully',booking});
}