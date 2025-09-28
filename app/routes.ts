import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    route("komoditas","./routes/komoditas.tsx"),
    route("data-komoditas-pangan","./routes/data-komoditas-pangan.tsx"),
    route("data-komoditas-hortikultura","./routes/data-komoditas-hortikultura.tsx"),
    route("data-komoditas-perkebunan","./routes/data-komoditas-perkebunan.tsx"),
    route("aspirasi-tani","./routes/aspirasi-tani.tsx"),
  ])
] satisfies RouteConfig;
