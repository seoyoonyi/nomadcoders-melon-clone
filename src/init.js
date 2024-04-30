import 'regenerator-runtime';
import 'dotenv/config';
import './db';
import app from './server';

const PORT = process.env.PORT || '4000'; 

const handleListening = () => console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, '0.0.0.0', handleListening); // Listen on all IPv4 addresses.
