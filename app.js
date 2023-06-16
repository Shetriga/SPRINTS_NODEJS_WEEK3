const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const cc = require("currency-converter-lt");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/products", (req, res, next) => {
  const curr = req.query.CUR;
  if (!curr) {
    return res.json({
      message: "Currency param is missing",
    });
  }

  getData(curr).then((response) => {
    return res.json({
      Data: response,
    });
  });
});

const getData = async (curr) => {
  const data = await axios.get("https://api.escuelajs.co/api/v1/products");
  if (data.status === 200) {
    let t = [];
    t = Object.entries(data["data"]);
    console.log(t);
    let currencyConverter = new cc();
    t.forEach((el) => {
      currencyConverter
        .from("USD")
        .to(curr)
        .amount(el[1].price)
        .convert()
        .then((result) => {
          el[1].price = result;
          console.log(result);
        });
    });
    return t;
  }
};

app.post("/products", (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const categoryId = req.body.categoryId;
  const images = req.body.images;

  if (!title || !price || !description || !categoryId || !images) {
    return res.json({
      message: "Payload is missing some data!",
    });
  }

  // Call the post request on the api
  const payLoad = {
    title: title,
    description: description,
    price: price,
    categoryId: categoryId,
    images: images,
  };
  axios
    .post("https://api.escuelajs.co/api/v1/products/", payLoad)
    .then((response) => {
      console.log(response["data"]);
      return res.json({
        message: response["data"],
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log(`Server is up and running`);
});
