import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import Events from "../models/events.js";
import EventsEnroll from "../models/eventenroll.js"

dotenv.config()

const router = express.Router();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SECRET_EMAIL, 
        pass: process.env.SECRET_PASSWORD 
    }
  });
  
router.get("/fetchAllEvents", async (req, res) => {
    try {
        const events = await Events.find({});
        res.json(events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addEvent", async (req, res) => {
    try {
        const event = new Events(req.body);
        const savedEvent = await event.save();
        res.json(savedEvent);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/eventEnroll", async (req, res) => {
    let ok = false;
    try {
        const existingEvent = await EventsEnroll.findOne({
            rollNo: req.body.rollNo,
            eventId: req.body.eventId
        });

        if (existingEvent) {
            res.status(400).json({ ok,error: "Event already enrolled for this student" });
            return;
        }

        const event = new EventsEnroll(req.body);
        const savedEvent = await event.save();
        ok = true;
        const mailOptions = {
            from: process.env.SECRET_EMAIL, 
            to: req.body.email,
            subject: 'Event Enrollment Confirmation', 
            text: `Dear ${req.body.studentName},\n\nThank you for enrolling for the event "${req.body.eventName}".\n\nYour enrollment details:\nRoll Number: ${req.body.rollNo}\nEvent ID: ${req.body.eventId}\n\nWe look forward to seeing you at the event!\n\nBest regards,\nYour Organization`, // Plain text body
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent successfully!');
              console.log('Message ID:', info.messageId);
            }
          });
       
        res.json({ok,savedEvent});
        
    } catch (error) {
        ok = false;
        console.error(error.message);
        res.status(500).json({ok,message:"Internal Server Error"});
    }
})

router.put("/updateEvent/:id", async (req, res) => {
    try {
        const { eventId, eventImage, eventName, eventDescription, eventDate, eventVenue } = req.body;
        const newEvent = {
            eventId,
            eventImage,
            eventName,
            eventDescription,
            eventDate,
            eventVenue
        };        
        let event = await Events.findById(req.params.id);
        if (!event) {
            return res.status(404).send("Event not found");
        }

        event = await Events.findByIdAndUpdate(req.params.id, { $set: newEvent }, { new: true });

        const registeredMembers = await EventsEnroll.find({ eventId: event.eventId });
        registeredMembers.forEach(async (member) => {
            const mailOptions = {
                from: process.env.SECRET_EMAIL,
                to: member.email,
                subject: 'Event Details Updated',
                text: `Dear ${member.studentName},\n\nThe details for the event "${event.eventName}" have been updated.\n\nNew Event Details:\nEvent ID: ${event._id}\nDescription: ${event.eventDescription}\nDate: ${event.eventDate}\nVenue: ${event.eventVenue}\n\nRegards,\nYour Organization`
            };

            await transporter.sendMail(mailOptions);
        });

        res.json({ event });
    } catch (error) {
        console.error('Error updating event details:', error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/deleteEvent/:id", async (req, res) => {
    try {
        let event = await Events.findById(req.params.id);
        if(!event) { return res.status(404).send("Not Found") }
        event = await Events.findByIdAndDelete(req.params.id);
        res.json({event: event});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
export default router;