import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export default (app) => {
    app.use(helmet());
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const allowedOrigin = process.env.CLIENT_URL;
            if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
            if (origin.endsWith('.vercel.app') || origin.startsWith('http://localhost:')) return callback(null, true);
            return callback(new Error('Not allowed by CORS (' + origin + ')'));
        },
        credentials: true
    }));
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    }));
};
