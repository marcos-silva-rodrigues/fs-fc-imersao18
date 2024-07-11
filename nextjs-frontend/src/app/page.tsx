import { EventCard } from "@/components/EventCard";
import { Title } from "../components/Title";
import { EventModel } from "../models";

export default async function HomePage() {
  const events: EventModel[] = []
  return (
    <main className="mt-10 flex flex-col">
      <Title>Eventos disponíveis</Title>
      <div className="mt-8 sm:grid sm:grid-cols-auto-fit-cards flex flex-wrap justify-center gap-x-2 gap-y-4">
      {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}