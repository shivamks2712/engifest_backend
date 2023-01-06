const validation = require('../../../validation');
const service = require('../../../service');


module.exports = {
    auth: async (req, res) => {
        try {

            const { error, value } = validation.user.createUser(req.body);

            if (error) {

                return res.status(400).send({

                    status: 400,
                    message: "Details Invalid",
                });
            }

            const { 
                name, 
                uid, 
                email, 
                photo 
            } = req.body;

            const newUser = await service.userService.createUser({
                name,
                uid,
                email,
                photo
            });

            console.log(newUser);


        } catch (err) {

            return res.status(400).json({
                success: false,
                err: "server error"
            });
        }
    }
};