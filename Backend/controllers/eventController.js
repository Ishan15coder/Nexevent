const Event=require('../models/Event');

exports.getAllEvents=async(req,res)=>{
    const filters={};
    if(req.query.category){
        filters.category=req.query.category;
    }
    if(req.query.location){
        filters.location=req.query.location;
    }
    try{
        const events= await Event.find(filters).sort({date:1});
        res.json(events);
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.getEventById=async(req,res)=>{
    try{
        const event= await Event.findById(req.params.id);  
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        res.json(event);
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.createEvent=async(req,res)=>{
    const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl}= req.body;
    try{
        const event= new Event({
            title,
            description,    
            date,
            location,
            category,   
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl,
            createdBy: req.user._id
        });
        const createdEvent= await event.save();
        res.status(201).json(createdEvent);
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.updateEvent=async(req,res)=>{
    try{
        const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl}=req.body;
        const event= await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        if(title) event.title=title;
        if(description) event.description=description;
        if(date) event.date=date;
        if(location) event.location=location;
        if(category) event.category=category;
        if(totalSeats!==undefined) event.totalSeats=totalSeats;
        if(availableSeats!==undefined) event.availableSeats=availableSeats;
        if(ticketPrice!==undefined) event.ticketPrice=ticketPrice;
        if(imageUrl) event.imageUrl=imageUrl;
        const updatedEvent= await event.save();
        res.json(updatedEvent);
    } catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.deleteEvent=async(req,res)=>{
    try{
        const event= await Event.findById(req.params.id);   
        if(!event){
            return res.status(404).json({message: 'Event not found'});
        }
        await Event.findByIdAndDelete(req.params.id);
        res.json({message: 'Event deleted successfully'});
    } catch(error){
        res.status(500).json({message: error.message});
    }
};