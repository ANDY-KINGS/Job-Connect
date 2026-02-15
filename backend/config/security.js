import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export default (app) => {
    app.use(helmet());
    app.use(cors({
        origin: process.env.CLIENT_URL || '*',
        credentials: true
    }));
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    }));
};
