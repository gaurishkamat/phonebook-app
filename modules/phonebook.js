const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// MONGODB_URI="mongodb+srv://gaurishkamat:MongoMe23@cluster0.qqlivo2.mongodb.net/phonebookApp?retryWrites=true&w=majority"
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then((url) => {
    console.log(`Successfully connected to Mongo DB`);
  })
  .catch((error) => {
    console.log(error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
    type: String,
    minLength: 13,
    validate: {
      validator: function (v) {
        return /\+\d{2,3}-\d{10}/.test(v);
      },
      message: (props) =>
        `${props.value} must be in the format +919922339855 CountryCode-Number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);