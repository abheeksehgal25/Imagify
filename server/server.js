import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

// Allow CORS from any origin
app.use(cors({ origin: '*' }))

// Basic environment validation and helpful startup logs
const maskUri = (uri) => {
	if (!uri) return '';
	try {
		// mask credentials if present: replace :password@ with :****@
		return uri.replace(/(\/\/.*?:).*?@/, '$1****@').slice(0, 120) + (uri.length > 120 ? '...' : '');
	} catch (e) {
		return '***';
	}
};

if (!process.env.JWT_SECRET) {
	console.error('FATAL: JWT_SECRET is not set. Set JWT_SECRET in the environment and restart the service.');
	process.exit(1);
}

if (!process.env.MONGODB_URI) {
	console.error('FATAL: MONGODB_URI is not set. Set MONGODB_URI to your MongoDB connection string (include database name).');
	process.exit(1);
} else {
	console.log('MONGODB_URI detected (masked):', maskUri(process.env.MONGODB_URI));
}

await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res) => res.send("API Working fine"))

app.listen(PORT, () => console.log('Server running on port ' + PORT))
