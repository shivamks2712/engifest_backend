const Razorpay = require("razorpay");
const uniqueId = require("uniqid");
const { createHmac } = require("crypto");
const Service = require("../service");
require("dotenv").config();
const request = require("request");
const axios = require("axios");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { user_cnt, email } = req.query;

      if (!user_cnt || user_cnt > 5 || !email) {
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

      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(400).send({
            success: false,
            message: "Order not created",
          });
        }

        let User = await Service.userService.getUser({ email });

        const newOrder = await Service.paymentService.createPaymentOrder({
          razorpay_order_id: order["id"],
          payment_status: false,
          userId: User.id,
          email: email,
          user_cnt: user_cnt,
        });

        return res.status(200).json({
          ...order,
          success: true,
          message: "Order sucessfully created",
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        err: "Server Error",
      });
    }
  },

  paymentCallback: async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const email = req.query.email;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !email ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: "Request Not Complete",
      });
    }

    const hash = createHmac("sha256", process.env.KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (razorpay_signature === hash) {
      try {
        const order = await Service.paymentService.getOrder({
          razorpay_order_id: razorpay_order_id,
        });

        let times = 0;
        const inverval_timer = setInterval(async () => {
          try {
            times++;

            const api_res = await axios.get(
              `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${razorpay_payment_id}`
            );
            console.log(api_res.data);

            if (api_res.data["status"] === "captured") {
              let User = await Service.userService.getUser({ email });
              User["isPaid"] = true;
              User["allowed_entries"] += order["user_cnt"];

              await Service.userService.updateUser(User);

              clearInterval(inverval_timer);

              return res.status(200).redirect(`${process.env.FRONTEND_URL}`);
            }
          } catch (err) {
            console.log(err);
          }

          if (times >= 3) {
            clearInterval(inverval_timer);

            return res.status(400).json({
              error: "Payment not captured",
            });
          }
        }, 10000);
      } catch (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
    } else {
      return res.status(400).json({
        error: "Payment Signature Mismatched",
      });
    }
  },
};
