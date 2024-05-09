//! membuat servernya dan menghubungkan ke mongoDB.
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const Product = require("./models/product");
const Farm = require("./models/farm");

const sessionOptions = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStandTake2")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  next();
});
//! ini untuk merender page di frontend dikarena kan 1 file tidak terpisah fe dan be.

const categories = ["fruit", "vegetable", "dairy"];
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

//! ini routenyaa Products.
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    console.log(products);
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    console.log(products);
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("farm", "name");
  console.log(product);
  res.render("products/show", { product });
});

app.post("/products/add", async (req, res) => {
  console.log(req.body);
  const newProduct = new Product(req.body);
  console.log(newProduct);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.put("/products/:id/update", async (req, res) => {
  const { id } = req.params;
  const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/products/${updateProduct._id}`);
});

app.delete("/products/:id/delete", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

//! end routes Products.

//! ini routenyaa Farm.
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms, messages: req.flash("success") });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/show", { farm });
});

app.post("/farms/add", async (req, res) => {
  const newFarm = new Farm(req.body);
  await newFarm.save();
  req.flash("success", "Successfully added new farm!");
  res.redirect("/farms");
});

app.get("/farms/:id/products/new", async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  res.render("products/new", { categories, farm });
});

app.post("/farms/:id/products/add", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save();
  await product.save();
  res.redirect(`/farms/${id}`);
});

app.delete("/farms/:id/delete", async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params.id);
  res.redirect("/farms");
});

//! end routes Farm.

app.listen(3000, () => console.log("Server running on port 3000"));
