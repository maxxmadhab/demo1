import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center pt-16 lg:pt-20">
      <div className="container-jwel py-16 text-center">
        <p className="font-display text-[5rem] font-medium leading-none text-charcoal/20 sm:text-[8rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-charcoal sm:text-4xl">
          This page has wandered off
        </h1>
        <p className="mx-auto mt-3 max-w-md font-body text-sm font-light text-stone">
          The page you're looking for doesn't exist or has been moved. Let's
          find something beautiful instead.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to="/" variant="primary">
            Back home
          </Button>
          <Button to="/catalog" variant="outline">
            Explore the collection
          </Button>
        </div>
      </div>
    </div>
  );
}