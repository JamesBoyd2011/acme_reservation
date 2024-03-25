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
  
  destroyReservation({id:vacation.id,customer_id:james.id});
  console.log(await fetchReservations());
};

init();
