import { env } from "@/env";

export const getPeople = () =>
  [
    { id: env.TEMP_USER_ID, name: "Patryk" },
    { id: "person-2", name: "Paulina" },
  ] as const;

export const people = getPeople();

export type Person = ReturnType<typeof getPeople>[number];

export const isValidPersonId = (id: string): boolean => {
  return people.some((p) => p.id === id);
};

export const getPersonById = (id: string) => {
  return people.find((p) => p.id === id);
};
