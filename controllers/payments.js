const Razorpay = require("razorpay");
const uniqueId = require("uniqid");
const { createHmac } = require("crypto");
const { use } = require("../routes");
require("dotenv").config();

const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

module.exports = {

    createOrder: async (req, res) => {
        
        try {

            const user_cnt = req.query['user_cnt'];

            if(!user_cnt || user_cnt > 5) {

                return res.status(400).send({
                    success: false,
                    message: "Please send valid number of participants",
                });
            }

            const finalPrice = 1000 * user_cnt;

            const options = {
        
                amount: finalPrice * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: uniqueId(),
            };
        
            instance.orders.create(options, function (err, order) {
            
                if(err) {
                    
                    return res.status(400).send({
                        success: false,
                        message: "Order not created",
                    });
                }
        
                return res.status(200).json({
                    ...order,
                    success: true,
                    message: "Order sucessfully created",
                });
            });

        } catch (err) {

            console.log(err)
            return res.status(500).json({

                success: false,
                err: "Server Error"
            });
        }
    },

    paymentCallback: async (req, res) => {
    
        const razorpay_order_id = req.body.razorpay_order_id, razorpay_payment_id = req.body.razorpay_payment_id, razorpay_signature = req.body.razorpay_signature
        const email = req.query.email, planid = req.query.planid

        if(!razorpay_order_id || !razorpay_payment_id || !email) {
            
            return res.status(400).json({
                error: 'Request Not Complete'
            });
        }

        const hash = createHmac("sha256", process.env.KEY_SECRET)
                        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                        .digest("hex");

        if (razorpay_signature === hash) {
            
            const payment_data = {

                email: email,
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                payment_status: "pending",
                // coupon: req.query.coupon
            };

            try {
                
                await razorpayPaymentRef.doc(razorpay_payment_id).set(payment_data);

                // Recurrent Job to check Payment Status every 5 seconds
                
                try {

                    await request(
                        `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${razorpay_payment_id}`,
                        async (error, response, body) => {
                            if (body) {

                                const result = JSON.parse(body);

                                if (result.status === "captured") {
                                    
                                    razorpayPaymentRef.doc(razorpay_payment_id).update({ 
                                        payment_status: "captured" 
                                    });
                                    
                                    const plan_detail = await PaymentPlansRef.doc(planid).get();
                                    const planDetail = plan_detail.data();
                                    
                                    const user = await usersRef.where("email", "==", email).get();
                                    const userData = {};

                                    user.forEach(user => {

                                        userData["id"] = user.id;
                                        userData["name"] = user.data().name;
                                        userData["email"] = user.data().email;
                                        userData["phone_no"] = user.data().phone_no;
                                        userData["plans_subscribed"] = user.data().plans_subscribed;
                                        userData["features"] = user.data().features;
                                    });
                                    
                                    if(!userData["plans_subscribed"])
                                        userData["plans_subscribed"] = {};

                                    if(!userData["features"])
                                        userData["features"] = {};

                                    const valid_till = Date.now() + planDetail['Validity'] * 24 * 60 * 60 * 1000;
                                    
                                    userData["plans_subscribed"][planid] = {
                                        timestamp: valid_till,
                                        date: new Date(valid_till),
                                        payment_id: razorpay_payment_id
                                    };

                                    const featuresList = Object.keys(paymentPlans[planid]['Features']);
                                    featuresList.forEach(feature => {

                                        if(userData["features"][feature] && userData["features"][feature].timestamp && userData["features"][feature].timestamp > valid_till)
                                            return;

                                        userData["features"][feature] = {
                                            timestamp: valid_till,
                                            date: new Date(valid_till)
                                        }
                                    });

                                    usersRef.doc(userData['id']).update({
                                        plans_subscribed: userData["plans_subscribed"],
                                        features: userData["features"]
                                    });
                                }

                                // TODO: Also update the Plan of User Accordingly
                            }
                        }
                    );

                } catch (err) {
            
                    console.log(err);
                }

                res.redirect(
                    `${process.env.FRONTEND_URL}`
                );

            } catch (err) {

                return res.status(400).json({
                    error: err.message
                });
            }

        } else {

            return res.status(400).json({
                error: 'Payment Signature Mismatched'
            });
        }
    }
};