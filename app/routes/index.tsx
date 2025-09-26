import { IndexView } from "~/features/index/IndexView";
import type { Route } from "./+types/index";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Form Pertanian" },
    { name: "description", content: "Form Pertanian" },
  ];
}

export default function Index() {
  return (
    <IndexView />
  );
}
