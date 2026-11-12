import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    position="top-right"
    toastOptions={{
      classNames: {
        toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton: "group-[.toast]:bg-primary group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-foreground"
      }
    }}
    {...props}
  />
);

export { Toaster };
