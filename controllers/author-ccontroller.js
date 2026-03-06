const mongoose=require('mongoose');
const Author=require('../models/Author');
const Book=require('../models/Book');
const createAuthor=async(req,res)=>{
    try {
        const {name,bio,birthDate}=req.body;
        
        // Check for existing author with same name
        const existingAuthor = await Author.findOne({ name });
        if (existingAuthor) {
            return res.status(409).json({
                success:false,
                message:'Author with this name already exists',
                data:existingAuthor
            });
        }
        
        const newAuthor=new Author({
            name,
            bio,
            birthDate
        });
        await newAuthor.save();
        if(newAuthor){
            res.status(201).json({
                success:true,
                message:'Author created successfully',
                data:newAuthor
            });
        }else{
            res.status(400).json({
                success:false,
                message:'Failed to create author'
            });
        }
    } catch (error) {
        res.status(400).json({
            success:false,  
            message:'Failed to create author',
            error:error.message
        });
    }
}
const getAuthors=async(req,res)=>{
    try { 
        const authors=await Author.find();
        res.status(200).json({
            success:true,
            message:'Authors retrieved successfully',
            data:authors
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:'Failed to retrieve authors',
            error:error.message
        });
    }
}

module.exports={
    createAuthor,
    getAuthors
}