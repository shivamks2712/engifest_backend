const Service = require("../service");
module.exports = {
  accCreate: async (req, res, next) => {
    try {
      const { checkin, checkout, femaleArr, maleArr } = req.body;
      if (!checkin || !checkout) {
        return res.status(400).json({ message: "Please send all the details" });
      }
      const obj = {
        checkin,
        checkout,
        maleCount: maleArr && maleArr.length ? maleArr.length : 0,
        femaleCount: femaleArr && femaleArr.length ? femaleArr.length : 0,
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

      return res.status(200).json({
        message: "Details are shared with the hospitality name",
      });
    } catch (error) {
      next(error);
    }
  },
};
