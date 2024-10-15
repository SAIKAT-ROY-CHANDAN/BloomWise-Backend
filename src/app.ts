import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/router';
import notFound from './app/middlewares/notFoundRoute';


const app: Application = express()

app.use(express.json());
// app.use(cors())
const corsOptions = {
  origin: true, // This allows all origins
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-refresh-token",
    "Origin",
    "X-Requested-With",
    "Accept",
    'Access-Control-Allow-Origin'
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api', router)

const test = (req: Request, res: Response) => {
  const a = 'Hello from the Bloom Wise'
  res.send(a)
}

app.get('/', test)
app.use(globalErrorHandler)
app.use(notFound)
// app.use(checkForNoData)

export default app