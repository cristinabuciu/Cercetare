
export interface SearchCardItems {
    id: number;
    domain: string;
	dataset_title: string;
	tags: string[];
	country: string;
	data_format: string;
	authors: string;
	year: string;
	article_title: string;
	short_desc: string;
	avg_rating_value: number;
	gitlink?: string;
	hasDownloadLink: string;
	downloadPath: string;
	owner: string;
	private: boolean;
}