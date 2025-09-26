import { Index } from "~/features/index";
import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Form Pertanian" },
    { name: "description", content: "Form Pertanian" },
  ];
}

export default function Home() {
  return (
    <Index />
  );
}
