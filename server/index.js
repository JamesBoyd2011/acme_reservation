const express = require("express");
const bodyParser = require("body-parser");

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation
} = require("./db");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    next(ex);
  }
});


app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (ex) {
    next(ex);
  }
});



app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(await createReservation(req.params));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/customers/:id/reservations/:id", async (req, res, next) => {
  try {
    res.status(204).send(await destroyReservation(req.params));
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  console.log("conneting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log(`created tables`);
  const [james, aaron, outback] = await Promise.all([
    createCustomer({ name: "James" }),
    createCustomer({ name: "Aaron" }),
    createRestaurant({ name: "Outback" }),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());

  const [vacation] = await Promise.all([
    createReservation({
      date: "03/04/1993",
      party_count: 13,
      restaurant_id: outback.id,
      customer_id: james.id,
    }),
  ]);
  console.log(await fetchReservations())
  
  // destroyReservation({id:vacation.id,customer_id:james.id});
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
