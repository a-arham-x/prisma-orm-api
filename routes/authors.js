const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {body, validationResult} = require("express-validator");

router.post("/", [
    body("name", {error: "Name must be provided"}).isLength({min: 1}),
    body("dateOfBirth", {error: "Date of birth must be provided"}).isDate(),
    body("country", {error: "Country of the author must be provided"}).isLength({min: 1})
], async (req, res)=>{

    // Checking for any errors so all the required fields are provided
    const errors = validationResult(req);

    // The user shall be informed in case of any error
    if (!errors.isEmpty()) {
        return res.json({ message: errors.errors[0].msg.error, success: false });
    }

    await prisma.authors.create({
        data: {
            name: req.body.name,
            date_of_birth: new Date(req.body.dateOfBirth),
            country: req.body.country
        }
    }).then(()=>{
        return res.json({message: "New Author created successfully", success: true})
    }).catch((e)=>{
        return res.json({error: e, success: false})
    })
})

router.get("/", async (req, res)=>{

    const authors = await prisma.authors.findMany();

    return res.json({authors, success: true})
})

router.get("/:id", async (req, res)=>{

    const author = await prisma.authors.findUnique({where: {id: parseInt(req.params.id)}});

    return res.json({author, success: true})
})

router.put("/:id", async (req, res)=>{

    const author = await prisma.authors.findUnique({where: {id: parseInt(req.params.id)}});

    const updatedAuthor = await prisma.authors.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            name: req.body.name?req.body.name:author.name,
            country: req.body.country?req.body.country:author.country
        }
    })

    return res.json({message: "Author updated successfully", updatedAuthor, success: true})
    
})  

router.delete("/:id", async (req, res)=>{

    await prisma.authors.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })

    return res.json({message: "The Author has been deleted", success: true})
})

module.exports = router;
