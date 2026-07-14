import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

const client = new MongoClient(uri);

const db = client.db(process.env.MONGODB_DB ?? "aesthete");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      img: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      wishlist: {
        type: "json",
        required: false,
        defaultValue: [],
      },
      cart: {
        type: "json",
        required: false,
        defaultValue: [],
      },
      orderHistory: {
        type: "json",
        required: false,
        defaultValue: [],
      },
      paymentHistory: {
        type: "json",
        required: false,
        defaultValue: [],
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: (user as { role?: string }).role ?? "user",
        }),
      },
    }),
  ],
});
