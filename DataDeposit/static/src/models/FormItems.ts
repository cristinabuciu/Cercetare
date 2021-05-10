export interface SelectList {
	value: string;
	label: string;
}

export interface DatasetMetadataForPost {
	dataset_title: string;
    article_title: string;
    short_desc: string;
    dataset_authors: string;
    year: number;
    domain: string;
    otherDomain: string | null;
    tags: Array<SelectList>;
    country: string;
    valueSwitch: boolean;
    gitlink: string;
    downloadPath: string;
    dataReuse: string;
    contAccess: string;
    dataIntegrity: string;
}

export interface UploadInputOptions {
	domain: Array<string>;
	tags: Array<SelectList>;
	tagList: {};
	country: Array<string>;
	dataFormats: Array<string>;
}

export interface UploadOption {
	none?: boolean;
	link: boolean;
	upload: boolean;
}