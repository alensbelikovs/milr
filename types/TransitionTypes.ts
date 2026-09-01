//   HERO:		/ and /projects/<slug>: opens on a full viewport scene
//   LIST:		/projects, /diary
//   OTHER:		everything else
export enum TransitionToType {
	HERO = "HERO",
	LIST = "LIST",
	OTHER = "OTHER",
}

export type TransitionParticipantMethod = () => Promise<void> | void

export type TransitionParticipantMethodsType = Record<string, TransitionParticipantMethod>
