export interface Participant {
  address: string;
  steps: number;
}

export interface Competition {
  address: string;
  participants: Participant[];
}