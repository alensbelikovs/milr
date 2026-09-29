//   HERO:		/ and /work/<slug>: opens on a full viewport scene
//   LIST:		/work, /diary
//   OTHER:		everything else
export enum TransitionToType {
	HERO = "HERO",
	LIST = "LIST",
	OTHER = "OTHER",
}

export type TransitionParticipantMethod = () => Promise<void> | void

export type TransitionParticipantMethodsType = Record<string, TransitionParticipantMethod>
