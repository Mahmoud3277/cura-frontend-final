export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    // This layout overrides the pharmacy layout for the register page
    // It simply returns the children without any wrapper
    return <>{children}</>;
}
