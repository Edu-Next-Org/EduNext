// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// export const authOption = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         username: { label: "userName", type: "text" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         if (
//           credentials?.username === "test" &&
//           credentials.password === "pass"
//         ) {
//           return { id: "1", name: "test user" };
//         }
//         return null;
//       },
//     }),
//   ],
// };
// const handler = NextAuth(authOption);
// export { handler as GET, handler as POST };
