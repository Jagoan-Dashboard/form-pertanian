import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    route("komoditas","./routes/komoditas.tsx"),
    route("data-komoditas","./routes/data-komoditas.tsx"),
    route("aspirasi-tani","./routes/aspirasi-tani.tsx"),
  ])
] satisfies RouteConfig;
