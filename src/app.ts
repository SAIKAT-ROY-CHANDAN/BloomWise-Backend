import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/router';
import notFound from './app/middlewares/notFoundRoute';


const app: Application = express()

app.use(express.json());
// app.use(cors())
const corsOptions = {
    origin: ['http://localhost:3000', 'https://bloom-wise.vercel.app'],  // Add your frontend URL here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Specify the allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],     // Include Authorization header for token validation
    credentials: true
  };
  
app.use(cors(corsOptions));

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