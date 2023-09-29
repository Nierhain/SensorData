import { z } from "zod";
import { env } from "../../../env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Measurement } from "~/models/Measurement";

const influxdb = new InfluxDB({ url: env.INFLUX_URL, token: env.INFLUX_TOKEN });

export const dataRouter = createTRPCRouter({
  dioxide: publicProcedure
    .input(z.object({
      start: z.date().optional(),
      end: z.date().optional()
    }))
    .query(async ({input}) => {
    const queryApi = influxdb.getQueryApi(env.INFLUX_ORG);
    let result = await queryApi.collectRows<Measurement>(`from(bucket: "${env.INFLUX_BUCKET}") 
        |> range(start: ${input.start}, end: ${input.end})
        |> filter(fn: (r) => r["device"] == "Sniffy")
        |> filter(fn: (r) => r["_field"] == "dioxide")  
        |> aggregateWindow(every: 5s, fn: mean, createEmpty: false)
        |> yield(name: "mean")`);
    return result;
  }),
});
