import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`API running on :${env.PORT}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
