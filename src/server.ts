import express from 'express';
import partnerRoutes from './routes/partner';
import orderRoutes from './routes/order';

const app = express();
const PORT = 3030;

app.use(express.json());
app.use('/partners', partnerRoutes,);
app.use('/orders',orderRoutes);
app.use('/item',orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});