const Service = require("../service");
const Validation = require("../validation");
const jwt = require("jsonwebtoken");
const client = require("@sendgrid/mail");
const qr = require("qr-image");
const AWS = require("aws-sdk");
const fs = require("fs");

client.setApiKey(process.env.SENDGRID_API_KEY);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const { error, value } = Validation.user.createUser(req.body);
      if (error) {
        return res.status(400).send({
          status: 400,
          message: "Please fill all the details and valid details",
          data: {},
        });
      }

      let { name, email, photo, uid } = req.body;

      const oldUser = await Service.userService.getUser({ email });

      if (oldUser) {
        const token = jwt.sign(
          {
            ...oldUser,
          },
          process.env.ACCESS_TOKEN_SECRET
        );

        return res.status(200).send({
          success: true,
          message: "login success",
          token: token,
        });
      }

      const count = await Service.userService.getUserCount();
      let zeroes = "";
      if (count < 10) {
        zeroes = "0000";
      } else if (count < 100 && count >= 10) {
        zeroes = "000";
      } else if (count < 1000 && count >= 100) {
        zeroes = "00";
      } else if (count < 10000 && count >= 1000) {
        zeroes = "0";
      } else {
        zeroes = "";
      }

      let ticket_number = `ENGI2K23/${zeroes}${count + 1}`;

      const userData = {
        name,
        email,
        photo,
        ticket_number,
        uid,
      };

      await Service.userService.createUser(userData);
      const token = jwt.sign(
        {
          ...userData,
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.status(200).json({
        status: 200,
        message: "User Saved",
        token: token,
      });
    } catch (error) {
      next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { error, value } = Validation.user.getUser(req.query);
      if (error) {
        return res.status(400).send({
          status: 400,
          message: "Please fill all the details",
          data: {},
        });
      }
      const { email } = req.query;
      let User = await Service.userService.getUser({ email });
      User["ticket_number"] = "";
      return res.status(200).json({
        status: 200,
        message: "User Details fetched successfully",
        data: User,
      });
    } catch (error) {
      next(error);
    }
  },
  decodeToken: async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token not passed",
        });
      }

      const token_data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await Service.userService.getUser({
        email: token_data.email,
      });

      return res.status(200).json({
        status: 200,
        message: "User Details fetched successfully",
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  },
  grantEntry: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await Service.userService.getUser({ id });
      if (user.isEntered || !user) {
        return res.status(400).json({
          status: 400,
          message: "User has already entered or invalid user",
          data: [],
        });
      }
      await Service.userService.updateUser({
        id,
        isEntered: true,
      });
      return res.status(200).json({
        status: 200,
        message: "Grant Entry to user",
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  },
  doVoting: async (req, res, next) => {
    try {
      const { error, value } = Validation.user.doVoting(req.body);
      if (error) {
        return res.status(400).send({
          status: 400,
          message: "Please fill all the details and valid details",
          data: {},
        });
      }
      const { email, vote } = req.body;
      const user = await Service.userService.getUser({ email });
      if (!user) {
        return res.status(400).send({
          status: 400,
          message: "Invalid Email",
          data: {},
        });
      }
      const question = await Service.questionService.getAllQuestions();
      if (question.length !== vote.length) {
        return res.status(400).send({
          status: 400,
          message: "Please do all the voting",
          data: {},
        });
      }
      const isVoted = true;
      await Promise.all(
        vote.map(async (element) => {
          await Service.questionService.incrementCount({
            id: element.questionId,
            field: element.option,
          });
        })
      );
      await Service.userService.updateUser({ id: user.id, isVoted });
      return res.status(200).json({
        status: 200,
        message: "Your Vote is captured successfully",
        userData: user,
      });
    } catch (error) {
      next(error);
    }
  },
  sendEmail: async (req, res, next) => {
    try {
      const { college, id, roll, phone } = req.body;
      if (!college || !id || !roll || !phone) {
        return res.status(400).send({
          status: 400,
          message: "Please send all the details",
          data: {},
        });
      }

      const user = await Service.userService.getUser({ id });
      if (!user) {
        return res.status(400).send({
          status: 400,
          message: "Invalid User",
          data: {},
        });
      }

      const ticket = user.ticket_number.split("/");
      const newTicket = `${ticket[0]}${ticket[1]}`;

      const qr_png = qr.image(
        JSON.stringify(`https://engifest.in/grant/entry/${user.id}`),
        {
          type: "png",
        }
      );
      qr_png.pipe(
        fs
          .createWriteStream(`controllers/${newTicket}.png`)
          .on("finish", () => {
            const filename = `${newTicket}.png`;
            const fileContent = fs.readFileSync("./controllers/" + filename);
            const params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `${filename}`,
              Body: fileContent,
            };
            s3.upload(params, (err, data) => {
              if (err) {
                reject(err);
              }

              require("fs-extra").remove("./controllers/" + filename, () => {});

              const msg = {
                from: "team@engifest.in",
                to: user.email, // Change to your recipient
                dynamic_template_data: {
                  name: user.name,
                  qr_code: data.Location,
                  ticket_number: user.ticket_number,
                },
                templateId: "d-ed93b86ed8cc4e74ae9956fcb2ae74c0",
              };

              client
                .send(msg)
                .then((response) => {
                  Service.userService.updateUser({
                    id,
                    college_name: college,
                    roll_number: roll,
                    phone_number: phone,
                  });
                })
                .catch((error) => {
                  return res.status(400).json({ message: "Unexpedted Issue" });
                });
            });
          })
      );

      return res.status(200).json({
        status: 200,
        message: "Email Send",
      });
    } catch (error) {
      next(error);
    }
  },
};
