export interface ResponseStatus {
	wasError?: boolean;
	wasInfo?: boolean;
	wasSuccess?: boolean;
	wasWarning?: boolean;
	responseMessage?: string;
}