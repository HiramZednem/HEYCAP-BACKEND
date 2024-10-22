import express, { Express } from 'express';
import morgan from 'morgan';
import { PORT } from './config'
import { routes } from './routes'
import cors from 'cors';
import { accessTokenAuth } from './middlewares/jwtAuth';
import rateLimit from 'express-rate-limit';


export class Server {
  private app: Express;

  constructor(){
    this.app = express();
    this.configuration();
    this.middlewares();
    this.routes();
  }

  configuration(){
    this.app.set('port', PORT || 3000);
  }

  middlewares(){
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());

    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, 
      max: 100, 
      message: 'Too many requests from this IP, please try again later.'
    });
    
    this.app.use(limiter);
  }

  routes(){
    this.app.get('/', (req, res)=>{
      res.status(200).json({
        name:'API'
      })
    });

    this.app.use('/api/v1/users', routes.usersRoutes);
    this.app.use('/api/v1/itineraries', accessTokenAuth, routes.itineraryRoutes);
    this.app.use('/api/v1/mercadopago', routes.paymentRoutes);
    this.app.use('/api/v1/places', accessTokenAuth, routes.placeRoutes);
    this.app.use('/api/v1/interactions', accessTokenAuth, routes.interactionRoutes);
    this.app.use('/api/v1/notifications', routes.notificationRoutes);


  }

  listen(){
    this.app.listen(this.app.get('port'), ()=>{
      console.log(`Server running on port ${this.app.get('port')}`);      
    })
  }

}