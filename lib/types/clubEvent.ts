export interface ClubEvent {

    id:number;

    clubId:number;

    clubName:string;

    title:string;

    description:string;

    venue:string;

    mode:string;

    startTime:string;

    endTime:string;

    registrationLink:string | null;

    coverImageUrl:string | null;

}