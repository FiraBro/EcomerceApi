import mongoose from "mongoose";
import Favorite from "./Favorite.js";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // add more fields as needed
});

itemSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Favorite.deleteMany({ item: doc._id });
    console.log(`Favorites for item ${doc._id} removed.`);
  }
  next();
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
