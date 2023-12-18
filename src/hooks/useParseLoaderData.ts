import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { BaseSchema, parse } from "valibot";

export const useParseLoaderData = <TSchema extends BaseSchema>(
  schema: TSchema,
) => {
  const loaderData = useLoaderData();

  console.log({ loaderData, step: "parseLoaderData" });
  const parsedLoaderData = useMemo(
    () => parse(schema, loaderData),
    [schema, loaderData],
  );
  return parsedLoaderData;
};
