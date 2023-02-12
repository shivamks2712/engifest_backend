const Service = require("../service");
const client = require("@sendgrid/mail");
client.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  accCreate: async (req, res, next) => {
    try {
      const { checkin, checkout, femaleArr, maleArr, phone, id } = req.body;
      if (!checkin || !checkout) {
        return res.status(400).json({ message: "Please send all the details" });
      }
      const obj = {
        checkin,
        checkout,
        maleCount: maleArr && maleArr.length ? maleArr.length : 0,
        femaleCount: femaleArr && femaleArr.length ? femaleArr.length : 0,
        phone,
      };
      const newAcc = await Service.accService.add(obj);
      if (femaleArr && femaleArr.length > 0) {
        await Promise.all(
          femaleArr.map((arr) => {
            const ada = {
              name: arr.name,
              age: arr.age,
              college: arr.clg,
              roll_number: arr.clgRNo,
              gender: "FEMALE",
              dob: arr.dob,
              accId: newAcc.id,
            };
            Service.accDetailService.add(ada);
          })
        );
      }
      if (maleArr && maleArr.length > 0) {
        await Promise.all(
          maleArr.map((arr) => {
            const ada = {
              name: arr.name,
              age: arr.age,
              college: arr.clg,
              roll_number: arr.clgRNo,
              gender: "MALE",
              dob: arr.dob,
              accId: newAcc.id,
            };
            Service.accDetailService.add(ada);
          })
        );
      }
      const user = await Service.userService.getUser({ id });
      const msg = {
        from: "hospitality@engifest.in",
        to: user.email, // Change to your recipient
        dynamic_template_data: {
          name: user.name,
          male_count: maleArr && maleArr.length ? maleArr.length : 0,
          female_count: femaleArr && femaleArr.length ? femaleArr.length : 0,
          Sender_Name: "Team Hospitality, Engifest",
          Sender_Address: "Delhi Technological University",
          Sender_City: "Rohini",
          Sender_State: "Delhi",
          Sender_Zip: "110042",
        },
        templateId: "d-1f39d6304bc640cab3d1e34518f05a79",
      };
      client
        .send(msg)
        .then((response) => {
          return res.status(200).json({
            message: "Details are shared with the hospitality name",
          });
        })
        .catch((error) => {
          console.log(error.response.body)
          return res.status(200).json({ message: "Unexpedted Issue" });
        });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const data = await Service.accService.getAll();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
