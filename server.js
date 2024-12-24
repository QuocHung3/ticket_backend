const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const app = express();
const port = 9999;
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json());
app.use('/api', userRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
