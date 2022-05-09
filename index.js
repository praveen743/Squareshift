const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jswt = require("jsonwebtoken");
const secret = "AkYeHoPkd";
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://praveen7:prmdb7@cluster0.dalgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.use(express.json())
app.use(cors({
    origin: "*"
}))


 //post product
app.post("/item", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("squareshift")
        await db.collection("items").insertOne(req.body)
         await connection.close();
        res.json({ message: "item Added" }) 
    } catch (error) {
        console.log(error)
    }
}); 
 
//get all product

app.get("/item", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("squareshift");
        let allitems = await db.collection("items").find({}).toArray();
        await connection.close();
        res.json(allitems);
    } catch (error) {
        console.log(error)
    }

});

//add item to cart
app.post("/cart/item", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("squareshift")
        let item = await db.collection("items").findOne({ id: req.body.product_id });
        
        if (item) {
            await db.collection("cart").insertOne(req.body)
            await connection.close();
           res.json({
            "status": "success",
            "message": "Item has been added to cart"
          }) 
        }else{
            res.json( {
                "status": "error",
                "message": "Invalid product id"
              })
           }
         
    } catch (error) {
        console.log(error)
    }
}); 
 
//get all the items in cart
app.get("/cart/item", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("squareshift");
        let allitems = await db.collection("cart").find({}).toArray();
        await connection.close();
        res.json(allitems);
    } catch (error) {
        console.log(error)
    }
});

//delete all items in cart
app.post("/cart/items", async function (req, res) {
    try {
        console.log(req.body)
        if(req.body.action ==="empty_cart"){
            let connection = await mongoClient.connect(URL);
            let db = connection.db("squareshift");
            var deldata = await db.collection("cart").deleteMany({})
            await connection.close();
            res.json({
                "status": "success",
                "message": "All items have been removed from the cart !"
              });
        }
       
    } catch (error) {
        console.log(error)
    }
});

//get total amount
var cartarr=[];
var finarr=[];
app.get("/cart/checkout-value", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("squareshift");
        let allitems = await db.collection("cart").find({}).toArray();
        // console.log(allitems[0].product_id);
        for(var i=0;i<=allitems.length-1;i++){
            cartarr.push({"id":allitems[i].product_id,
            "quantity":allitems[i].quantity
        })
        }
        // console.log(cartarr)
        for(var i=0;i<=cartarr.length-1;i++){
            var getitem = await db.collection("items").find({id:cartarr[i].id}).toArray();
            finarr.push(getitem)
        }
        console.log(finarr[0][0].price)
         

        // var total = 0;
        // for(var i=0;i<=2;i++){
        //     // var total = total + finarr[i][i].price
        //     console.log(finarr[1][1].price)
        // }
        // console.log(total);
        await connection.close();
        res.json(allitems);
    } catch (error) {
        console.log(error)
    }
});

app.listen(3001,console.log("app is running"))
