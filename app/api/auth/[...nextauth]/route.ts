// API route for NextAuth authentication with Google provider
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { apiRequest } from "@/utils/api";

// Configure NextAuth handler
const handler = NextAuth({
    providers: [
        // Google OAuth provider configuration
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            secret: process.env.NEXTAUTH_SECRET,
        }),
    ],
    callbacks: {
        // Callback after successful sign-in
        async signIn(params) {
            const { user, profile } = params;
            // return true
            try {
                // Register or update user in backend
                await apiRequest({
                    method: "POST",
                    url: process.env.NEXT_PUBLIC_BACKEND_URL + "/users",
                    data: {
                        name: user?.name,
                        email: user?.email,
                        image: user?.image,
                        metadata: profile,
                    },
                });
                return true; // Allow sign-in
            } catch (error) {
                // Log and block sign-in if registration fails
                console.error("User registration failed:", error);
                return false; // Block sign-in if user registration fails
            }
        },
    },
});

// Export handlers for GET and POST requests
export { handler as GET, handler as POST };
