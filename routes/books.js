const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {body, validationResult} = require("express-validator");

router.post("/", [
    body("title", {error: "Title of the book must be provided"}).isLength({min: 1}),
    body("genre", {error: "Genre of the book must be provided"}).isLength({min: 1}),
    body("author", {error: "Author ID must be provided"}).isNumeric()
], async (req, res)=>{

    // Checking for any errors so all the required fields are provided
    const errors = validationResult(req);

    // The user shall be informed in case of any error
    if (!errors.isEmpty()) {
        return res.json({ message: errors.errors[0].msg.error, success: false });
    }

    const author = await prisma.authors.findUnique({where:{id: parseInt(req.body.author)}});
    
    if (!author){
        return res.json({message: "No author found with the provided author id", success: false});
    }

    const book = await prisma.books.create({
        data: {
            title: req.body.title,
            genre: req.body.genre,
            author: {
                connect: { id: parseInt(req.body.author) }
            }
        }
    })

    return res.json({message: "New book created", book, success: true})

})

router.get("/", async (req, res)=>{

    const books = await prisma.books.findMany();

    return res.json({books, success: true})
})

router.get("/:id", async (req, res)=>{
    const book = await prisma.books.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })

    return res.json({book, success: true})
})

// route to get the books of a specific author
router.get("/author/:id", async (req, res)=>{
    const books = await prisma.books.findMany({where: {author_id: parseInt(req.params.id)}})

    return res.json({books, success: true})
})

router.put("/:id", async (req, res)=>{

    const book = await prisma.books.findUnique({where:{id:parseInt(req.params.id)}})

    const updatedBook = await prisma.books.update({
        where: {
            id: parseInt(req.params.id)
        },
        data:{
            title: req.body.title?req.body.title:book.title,
            genre: req.body.genre?req.body.genre:book.genre
        }
    })

    return res.json({message: "The book has been updated", updatedBook, success: true})
})

router.delete("/:id", async(req, res)=>{

    await prisma.books.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })

    return res.json({message: "The book has been deleted", success: true})
})


module.exports = router;