import type { Route } from "./+types/home";
import { App } from "../features/index/app";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Form Pertanian" },
    { name: "description", content: "Form Pertanian" },
  ];
}

export default function Home() {
  return <App />;
}
