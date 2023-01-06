const Service = require("../service");
const Validation = require("../validation");

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

      let { access_token, name, email, image_url, college_name, phone_number } = req.body;
      let isDtu = false;
      let allowed_entries = 0;
      let isPaid = false;
      const oldUser = await Service.userService.getUser({ email });
      if (oldUser) {
        return res.status(400).send({
          status: 400,
          message: "Email already added",
          data: {},
        });
      }
      const participant = await Service.participantService.getParticipant({
        email,
      });
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

      let ticket_number = `ENGI2K23/${zeroes}${count + 1}/00`;
      if (participant) {
        ticket_number = participant.ticket_number;
        isPaid = true;
      }

      if (email.split("@")[1] === "dtu.ac.in") {
        isDtu = true;
        isPaid = true;
        allowed_entries = 0;
        college_name = "Delhi Technological University";
      }

      const newUser = await Service.userService.createUser({
        access_token,
        name,
        email,
        image_url,
        college_name,
        phone_number,
        isDtu,
        allowed_entries,
        ticket_number,
        isPaid,
      });

      return res
        .status(200)
        .json({ status: 200, message: "User Saved", data: newUser });
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
};
