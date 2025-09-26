import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/home.tsx"),
    route("form","./routes/form.tsx")
  ])
] satisfies RouteConfig;
