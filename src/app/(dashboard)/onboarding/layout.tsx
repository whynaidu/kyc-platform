export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-2xl mx-auto">
            {children}
        </div>
    );
}
