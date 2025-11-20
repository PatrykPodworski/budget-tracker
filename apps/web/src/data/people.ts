import { env } from "@/env";

export const people = [
  { id: env.TEMP_USER_ID, name: "Me" },
  { id: "person-2", name: "Partner" },
] as const;

const personIds = new Set(people.map((p) => p.id));

export type Person = (typeof people)[number];

export const isValidPersonId = (id: string): boolean => {
  return personIds.has(id);
};

export const getPersonById = (id: string) => {
  return people.find((p) => p.id === id);
};
