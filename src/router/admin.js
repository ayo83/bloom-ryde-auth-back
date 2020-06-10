const express = require('express');
const router = new express.Router();
const Admin = require('../model/Admin');
const gravatar = require('gravatar');
const adminAuth = require('../middleware/adminAuth');

// Creating Admin
router.post('/api/add-admin',  async (req, res)=>{
    const adminData = req.body;
    adminData.avatar = gravatar.url(adminData.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    const admin = new Admin(adminData);
    try {
        await admin.save()
        res.status(201).send({
            status: 'Success',
            data: admin
        });
    } catch (error) {
        res.status(400).send(error);
    }
    
});

// Signing Admin
router.post('/api/login', async(req, res)=>{
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        res.send({ admin, token});
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Invalid Login Details'});
    }
});

// Loging Out user
router.post('/api/logoutAll', adminAuth, async(req, res)=>{
    try {
        req.admin.tokens = [];
        await req.admin.save();
        res.status(200).json({
            status: 'Success',
            message: 'Successfully Logged out from all Devices'
        })
    } catch (error) {
        res.status(500).send({message: 'Internal Error'});
    }
})

router.post('/api/logout', adminAuth, async (req, res)=>{
    try {
        req.admin.tokens = req.admin.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.admin.save();
        res.status(200).json({
            status: 'Success',
            message: 'Successfully Logged out'
        })
    } catch (error) {
        res.status(500).send({message: 'Internal Error'})
    }
});

module.exports = router;