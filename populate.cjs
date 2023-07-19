const { readFile } = require('fs/promises');

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db/connect');
const Job = require('./models/Job');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();

    const jsonProducts = JSON.parse(
      await readFile('./mock_data.json', { encoding: 'utf8' })
    );
    await Job.create(jsonProducts);
    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
