import express from "express";
import nodemailer from "nodemailer";

import Workshops from "../models/workshops.js";
import WorkshopsEnroll from "../models/workshopenroll.js";


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SECRET_EMAIL, 
        pass: process.env.SECRET_PASSWORD 
    }
  });

const router = express.Router();

router.get("/fetchAllWorkshops", async (req, res) => {
    try {
        const workshops = await Workshops.find({});
        res.json(workshops);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addWorkshop", async (req, res) => {
    try {
        const workshop = new Workshops(req.body);
        const newWorkshop = await workshop.save();
        res.json(newWorkshop);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/workshopEnroll", async (req, res) => {
    let ok = false;

    try {
        const existingWorkshop = await WorkshopsEnroll.findOne({
            rollNo: req.body.rollNo,
            workshopId: req.body.workshopId
        });
        if (existingWorkshop) {
            res.status(400).json({ ok,error: "Workshop already enrolled for this student" });
            return;
        }
        const mailOptions = {
            from: process.env.SECRET_EMAIL, 
            to: req.body.email,
            subject: 'Workshop Enrollment Confirmation', 
            text: `Dear ${req.body.username},\n\nThank you for enrolling for the competition "${req.body.workshopName}".\n\nYour enrollment details:\nRoll Number: ${req.body.rollNo}\nCompetition ID: ${req.body.workshopId}\n\nWe look forward to seeing you at the competition!\n\nBest regards,\nYour Organization`, // Plain text body
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent successfully!');
            }
          });
        const record = new WorkshopsEnroll(req.body);
        const savedRecord = await record.save();
        ok = true;
        res.json({ok,savedRecord});
    } catch (error) {
        ok = false;

        console.error(error.message);
        res.status(500).send({ok,message:"Internal Server Error"});
    }
})


router.put("/updateWorkshop/:id", async (req, res) => {
    try {
        const { workshopId, workshopUrl, workshopTitle, workshopDescription, workshopPrice, workshopDate } = req.body;
        const newWorkshop = {};
        if (workshopUrl) { newWorkshop.workshopUrl = workshopUrl; }
        if (workshopTitle) { newWorkshop.workshopTitle = workshopTitle; }
        if (workshopDescription) { newWorkshop.workshopDescription = workshopDescription; }
        if (workshopDate) { newWorkshop.workshopDate = workshopDate; }
        if (workshopPrice) { newWorkshop.workshopPrice = workshopPrice; }

        let workshop = await Workshops.findById(req.params.id);
        if (!workshop) {
            return res.status(404).send("Workshop not found");
        }

        const updatedWorkshop = await Workshops.findByIdAndUpdate(req.params.id, { $set: newWorkshop }, { new: true });

        
        const registeredMembers = await WorkshopsEnroll.find({ workshopId: workshopId });

       
        const emailPromises = registeredMembers.map(async (member) => {
            const mailOptions = {
                from: process.env.SECRET_EMAIL,
                to: member.email,
                subject: 'Workshop Details Updated',
                text: `Dear ${member.username},\n\nThe details for the workshop "${updatedWorkshop.workshopName}" have been updated.\n\nNew Workshop Details:\nWorkshop ID: ${updatedWorkshop._id}\nDescription: ${updatedWorkshop.workshopDescription}\nPrice: ${updatedWorkshop.workshopPrice}\nDate: ${updatedWorkshop.workshopDate}\n\nRegards,\nYour Organization`
            };

            
            return transporter.sendMail(mailOptions);
        });

       
        await Promise.all(emailPromises);

        res.json({ workshop: updatedWorkshop });
    } catch (error) {
        console.error('Error updating workshop details:', error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.delete("/deleteWorkshop/:id", async (req, res) => {
    try {
        let workshop = await Workshops.findById(req.params.id);
        if(!workshop) { return res.status(404).send("Not Found") }
        workshop = await Workshops.findByIdAndDelete(req.params.id);
        res.json({workshop: workshop});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



export default router;