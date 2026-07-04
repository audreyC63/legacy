import { LegacyEvent } from "./Event";

export interface Family {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
  motherOne: string;
  motherTwo: string;
  events: LegacyEvent[];

  profilePhoto?: string;
  birthPlace?: string;
  birthWeight?: string;
  birthHeight?: string;
  bloodGroup?: string;
  eyeColor?: string;
  hairColor?: string;
}