import { Game } from "~/components/Game";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Dragon Ball Memory" },
    {
      name: "description",
      content: "A memory card game with Dragon Ball characters. Match every pair in as few moves as you can.",
    },
  ];
}

export default function Home() {
  return <Game />;
}
