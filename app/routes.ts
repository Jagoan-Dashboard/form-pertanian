import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    route("komoditas","./routes/komoditas.tsx")
  ])
] satisfies RouteConfig;
