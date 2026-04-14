import express from 'express';
import partnerRoutes from './routes/partner';
import orderRoutes from './routes/order';
import productionRoutes from './routes/production'; 

const app = express();
const PORT = 3030;

app.use(express.json());
app.use('/partners', partnerRoutes,);
app.use('/orders',orderRoutes);
app.use('/production', productionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});