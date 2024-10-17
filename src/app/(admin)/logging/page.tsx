import UserActivityLogger from "@/components/logging/UserActivityLogger";

export default function RootLayout({}: { children: React.ReactNode }) {
    return <UserActivityLogger />;
}
