const express = require("express");
const uuid = require("uuid");

const port = 3033;

const app = express();
app.use(express.json());

const customerOrders = []; /* IMPORTANTE ! LIST TO ORDERS VARIABLE*/

/* MIDDLEWARES - RESPONSIBLE VARIABLE REAL ID */

const CheckUserId = (request, response, next) => {
  const { id } = request.params;

  const index = customerOrders.findIndex(
    (OrderRequested) => OrderRequested.id === id
  );

  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }

  /* FUNCTION CALLING INDEX AND ID*/
  request.orderIndex = index;
  request.orderId = id;

  next();
};

/*  REQUSITION METHOD AND REQUEST URL */
const method = (request, response, next) => {
  console.log(request.method);

  next();
};


app.get("/order", method, (request, response) => {
  return response.json(customerOrders);
});

app.post("/order", method, (request, response) => {
  const { order, clienteName, price } = request.body;

  const OrderRequested = {
    id: uuid.v4(),
    order,
    clienteName,
    price,
    status: "Em preparação",
  };

  customerOrders.push(OrderRequested);

  return response.status(201).json(customerOrders);
});

app.put("/order/:id", method, CheckUserId, (request, response) => {
  const { order, clienteName, price } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;

  const updateOrder = { id, order, clientName, price, status: "Em preparação" };

  customerOrders[index] = updateOrder;
  return response.json(updateOrder);
});

app.delete("/order/:id", method, CheckUserId, (request, response) => {
  const id = request.orderId;
  const index = request.orderIndex;

  customerOrders.splice(index, 1);

  return response.status(204).json(customerOrders);
});


/* This route receives the id in the parameters and must return a specific request.*/

app.get('/OrderSpecifies/:id', method, CheckUserId, (request, response) => {
  const id = request.orderId
  const index = request.orderIndex

  const OrderSpecifies = customerOrders[index]

  return response.json(OrderSpecifies)
})

/* This route receives the id in the parameters and as soon as it is called, it should change the status of the request received by id to "Ready". */

app.patch('/order/:id', method, CheckUserId, (request, response) => {
  const { order, clientName, price } = request.body
  const index = request.orderIndex
  const id = request.orderId

  const updateOrderPatch = { id, order, clientName, price, status: "Pedido Finalizado" }
  customerOrders[index] = updateOrderPatch
  console.log(updateOrderPatch)

  return response.json(updateOrderPatch)
})

app.listen(port, () => {
  console.log("PORTA LIBERADA");
});
