import NextAuth from "next-auth";
import "server-only";
import { authOptions } from "../../../../server/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
