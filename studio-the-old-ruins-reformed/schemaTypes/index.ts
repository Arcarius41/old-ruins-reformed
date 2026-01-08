import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [category, post];
