import express, { Express } from 'express';
import morgan from 'morgan';
import { PORT } from './config'
import { routes } from './routes'
import cors from 'cors';
import { accessTokenAuth } from './middlewares/jwtAuth';


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
    this.app.use('/api/v1/places', routes.placeRoutes);
    this.app.use('/api/v1/interactive', routes.interactiveRouter);


  }

  listen(){
    this.app.listen(this.app.get('port'), ()=>{
      console.log(`Server running on port ${this.app.get('port')}`);      
    })
  }

}