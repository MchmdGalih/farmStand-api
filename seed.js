const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStandTake2")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
    console.log(err);
  });

// const p = new Product({
//   name: "Ruby Grapefruit",
//   price: 1.99,
//   category: "fruit",
// });
// p.save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const seedProduct = [
  {
    name: "Fairy Eggplant",
    price: 1.99,
    category: "vegetable",
  },
  {
    name: "Organic Goddess",
    price: 4.99,
    category: "fruit",
  },
  {
    name: "Organic Mini Seedless Watermelon",
    price: 3.99,
    category: "fruit",
  },
  {
    name: "Organic Celery",
    price: 1.99,
    category: "vegetable",
  },
  {
    name: "Chocolate Whole Milk",
    price: 2.69,
    category: "dairy",
  },
];

Product.insertMany(seedProduct)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
