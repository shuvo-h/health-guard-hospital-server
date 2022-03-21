// require and import 
const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// app and port 
const app = express();
const port = process.env.PORT || 5000;

// middle wear 
app.use(cors());
app.use(express.json());

// user info 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// server run function 
async function run(){
    try{
        await client.connect();

        const database = client.db("HolydayVision");
        const departmentCollection = database.collection("medicalDepartments");
        const newsCollection = database.collection("medicalNews");
        const consultantCollection = database.collection("medicalConsultant");
        const appointmentCollection = database.collection("medicalAppointments");
        const doctorsCollection = database.collection("medicalDoctors");
        const usersCollection = database.collection("medicalUsers");

        app.get("/hospital/departments", async(req,res)=>{
            const cursor =  departmentCollection.find({})
            const departments = await cursor.toArray();
            res.json(departments)
        })
        app.get("/hospital/department/:id", async(req,res)=>{
            const id = req.params.id
            const department = await departmentCollection.findOne({_id: ObjectId(id)});
            res.json(department)
        })
        
        app.get("/hospital/news", async(req,res)=>{
            const cursor = newsCollection.find({})
            const news = await cursor.toArray();
            res.json(news);
        })
        app.get("/hospital/news/:id", async(req,res)=>{
            const id = req.params.id
            const news = await newsCollection.findOne({_id: ObjectId(id)});
            res.json(news)
        })
        
        app.get("/hospital/consultant", async(req,res)=>{
            const cursor = consultantCollection.find({})
            const consultants = await cursor.toArray();
            res.json(consultants);
        })
        app.post("/hospital/appointments", async(req,res)=>{
            const appointmentInfo = req.body;
            const result = await appointmentCollection.insertOne(appointmentInfo)
            res.json(result);
        })
        app.get("/hospital/appointments", async(req,res)=>{
            const cursor =  appointmentCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
        })
        app.delete("/hospital/appointments/:id", async(req,res)=>{
            const id = req.params.id
            const result = await appointmentCollection.deleteOne({_id: ObjectId(id)});
            res.json(result)
        })
        
        app.get("/hospital/doctors", async(req,res)=>{
            const cursor = doctorsCollection.find({})
            const doctors = await cursor.toArray();
            res.json(doctors);
        })
        app.get("/hospital/doctors/:id", async(req,res)=>{
            const id = req.params.id
            const doctor = await doctorsCollection.findOne({_id: ObjectId(id)});
            res.json(doctor)
        })
        app.post("/hospital/registration", async(req,res)=>{
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
        })
        app.get('/hospital/users',async(req,res)=>{
            const queryMail = req.query.existEmail;
            const query = {email: queryMail}
            const searchedMail = await usersCollection.findOne(query) || {}
            res.json(searchedMail)
        })
        app.post('/hospital/user/discount',async(req,res)=>{
            const newValue = req.body.newDiscount;
            const updateResult = await usersCollection.updateOne(
                {
                    email: "test@test.com"
                },
                {
                    $set:{
                        discount: newValue
                    }
                },
                {
                    upsert: false
                }
            ) 
            res.json(updateResult)
        })
        app.get('/hospital/user/discount',async(req,res)=>{
            const cursor = usersCollection.find({email:"test@test.com"}).project({_id:0,discount:1});
            const discount = await cursor.toArray();
            console.log(discount[0]);
            res.json(discount[0])
        })
        // app.get("/hospital/doctors", async(req,res)=>{
        //     const collectionCreate = await doctorsCollection.insertOne({createFolder:"new data"})
        //     console.log(collectionCreate);
        // })
        
    }finally{
        // await client.close();
    }
}
run().catch(console.dir);

// initial test server run 
app.get('/',(req,res)=>{
    res.send("Running Health Guard Hospital Server!")
})
// port listen  
app.listen(port,()=>{
    console.log("Server is running on port ",port);
})