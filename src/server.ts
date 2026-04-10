import express from 'express';
import partnerRoutes from './routes/partner';

const app = express();
const PORT = 3030;

app.use(express.json());
app.use('/partners', partnerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});