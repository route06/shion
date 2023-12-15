import type { PluginData } from "@cloudflare/pages-plugin-cloudflare-access";
import { drizzle } from "drizzle-orm/d1";
import { omit, parse } from "valibot";
import * as schema from "../../db/schema";
import { Env } from "../env";
export const onRequestGet: PagesFunction<Env, string, PluginData> = async ({
  env,
  data,
}) => {
  const db = drizzle(env.DB, { schema });
  const user = await db.query.users.findFirst({
    where: (users, { eq }) =>
      eq(users.email, data.cloudflareAccess.JWT.payload.email ?? "noemail"),
  });
  if (user == null) {
    return new Response("no user found", { status: 404 });
  }
  return new Response(JSON.stringify({ user }), {
    headers: {
      "content-type": "application/json",
    },
  });
};

export const onRequestPost: PagesFunction<Env, string, PluginData> = async ({
  env,
  data,
  request,
}) => {
  const json = await request.json();
  const { username } = parse(omit(schema.insertUsersSchema, ["email"]), json);
  const db = drizzle(env.DB, { schema });
  const email = data.cloudflareAccess.JWT.payload.email ?? "noemail";
  const results = await db
    .insert(schema.users)
    .values({ username, email })
    .returning({ insertedId: schema.users.id });
  console.log(results);
  return new Response(JSON.stringify(results), {
    headers: {
      contentType: "application/json",
    },
  });
};