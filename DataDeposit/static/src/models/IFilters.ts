export interface IFilters {
	notArrayParams: NotArrayParams;
	arrayParams: ArrayParams;
	sortBy: string;
	sortByField: string;
	count: boolean;
	resultsPerPage: number;
	currentPage: number;
	totalResults: number;
}

interface NotArrayParams {
	domain: string;
	country: string;
	data_format: string;
	year: string;
	dataset_title: string;
	downloadType: string;
	userId: number | undefined;
}

interface ArrayParams {
	tags: Array<string>;
	author: Array<string>;
}
