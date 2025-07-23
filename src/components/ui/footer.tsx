export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-4 px-6 mt-auto">
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Zapcom. All rights reserved.
        </p>
      </div>
    </footer>
  );
};