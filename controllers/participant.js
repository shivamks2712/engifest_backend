const Service = require("../service");
const Validation = require("../validation");

module.exports = {
  addParticipants: async (req, res, next) => {
    try {
      const { error, value } = Validation.participant.addParticipant(req.body);
      if (error) {
        return res.status(400).send({
          status: 400,
          message: "Please fill all the details and valid details",
          data: {},
        });
      }
      const { email, participants } = req.body;
      const user = await Service.userService.getUser({ email });
      if (!user) {
        return res.status(400).send({
          status: 400,
          message: "Please send the correct email",
          data: {},
        });
      }
      const allowed_entries = user.allowed_entries;
      const allParticipantsCount =
        await Service.participantService.getParticipantCount({
          userId: user.id,
        });
      if (allParticipantsCount === allowed_entries) {
        return res.status(400).send({
          status: 400,
          message: "All Entries are already completed",
          data: {},
        });
      }
      const remainingEntriesSize = Number(
        allowed_entries - allParticipantsCount
      );
      if (remainingEntriesSize !== participants.length) {
        return res.status(400).send({
          status: 400,
          message: "Dont send extra extries or less entries",
          data: {},
        });
      }
      await Promise.all(
        participants.map(async (element) => {
          const email = element.email;
          const participantUser = await Service.userService.getUser({ email });
          const participant = await Service.participantService.getParticipant({
            email,
          });
          if (participantUser.isPaid || participant) {
            return res.status(400).send({
              status: 400,
              message: "Ticket is already bought for that user",
              data: { email },
            });
          }
          if (email.split("@")[1] === "dtu.ac.in") {
            return res.status(400).send({
              status: 400,
              message:
                "You cannot add DTU students as they can have free entries",
              data: { email },
            });
          }
        })
      );
      await Promise.all(
        participants.map(async (element) => {
          const name = element.name;
          const college_name = element.college_name;
          const email = element.email;
          const phone_number = element.phone_number;
          const participantCount =
            await Service.participantService.getParticipantCount({
              userId: user.id,
            });
          const userCount = user.ticket_number.split("/")[1];
          const ticket_number = `ENGI2K23/${userCount}/${participantCount + 1}`;

          await Service.participantService.addParticipant({
            name,
            college_name,
            email,
            phone_number,
            ticket_number,
          });
        })
      );
      return res.status(200).json({
        status: 200,
        message: "Participants Saved",
        data: participants,
      });
    } catch (error) {
      next(error);
    }
  },
};
