import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("./routes/root-layout.tsx", [
    index("./routes/index.tsx"),
    ...prefix("komoditas", [
      index("./routes/komoditas.tsx"),
      route("pangan","./routes/data-komoditas-pangan.tsx"),
      route("hortikultura","./routes/data-komoditas-hortikultura.tsx"),
      route("perkebunan","./routes/data-komoditas-perkebunan.tsx"),
    ]),
    route("aspirasi-tani","./routes/aspirasi-tani.tsx"),
  ])
] satisfies RouteConfig;
