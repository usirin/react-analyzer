import raw from "./raw";
import countComponents from "./countComponents";
import countComponentsAndProps from "./countComponentsAndProps";
import aliases from "./aliases";
import path from "path";
import { Report } from "../types";

const FORMATTERS = {
  raw: raw,
  count: countComponents,
  "count-props": countComponentsAndProps,
  aliases: aliases,
};

export async function loadFormatter(formatterName: string | undefined) {
  if (!formatterName) {
    return raw;
  } else if (formatterName in FORMATTERS) {
    return FORMATTERS[formatterName as keyof typeof FORMATTERS]!;
  } else {
    try {
      const pathName = path.join(process.cwd(), formatterName);
      const processorFile = await import(pathName);
      return processorFile.default as (report: Report) => Record<string, any>;
    } catch (e) {
      throw new Error(`Could not load reporter ${formatterName}`);
    }
  }
}