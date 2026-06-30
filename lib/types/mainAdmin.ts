export interface UserSummary {

  id: number;

  name: string;

  email: string;

  role: string;

  accountStatus: string;

  clubManager: boolean;

}
export interface UserClubAssignment {

  userClubId: number;

  clubId: number;

  clubName: string;

}
export interface Club {

  id: number;

  name: string;

  description: string;

  logoUrl: string;

}