/* eslint-disable @typescript-eslint/no-unused-vars */
import {Server} from 'http'
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string)

        server = app.listen(config.port, () => {
            console.log(`Bloom Wise is listing on port ${config.port}`);
        })
        console.log('Mongodb is connected');
    } catch (error) {
        console.log(error);
    }
}

main()