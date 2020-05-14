CREATE SEQUENCE table_name_id_seq;

CREATE TABLE loginTable (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
); 


insert into loginTable(username, password) values('John', 'abcd');
insert into loginTable(username, password) values('admin', 'admin');

CREATE TABLE datasets (
    id BIGSERIAL PRIMARY KEY,
    domain TEXT NOT NULL,
    subdomain TEXT[] NOT NULL, -- ARRAY
    country TEXT NOT NULL,
    data_format TEXT NOT NULL,
    author TEXT[] NOT NULL, -- autori despariti prin virgula ARRAY
    year TEXT NOT NULL,
    dataset_title TEXT NOT NULL,
    article_title TEXT NOT NULL,
    info JSONB
);

    -- article_url TEXT NOT NULL,
    -- full_description TEXT NOT NULL,
    -- demo_description TEXT NOT NULL,
    -- GIT_url TEXT NOT NULL,
    -- avg_rating_value FLOAT(2) NOT NULL,
    -- rating_commits BIGINT NOT NULL

insert into datasets(domain, subdomain, country, data_format, author, year, dataset_title, article_title, info) 
values('IT', '{"SOFTWARE", "HARDWARE"}', 'Romania', 'zip', '{"Dorian", "Sam", "Macac", "Jack"}', '2015', 'Dezvoltarea aplicatiilor internet', 'Mare site', '{"article_url": "https://www.google.com/?wow", "full_description": "abcd", "demo_description": "a", "GIT_url": "www.git.hub", "avg_rating_value": 4.58, "rating_commits": 700}');

insert into datasets(domain, subdomain, country, data_format, author, year, dataset_title, article_title, info) 
values('MEDICINE', '{"SURGERY", "PRACTICE"}', 'France', 'zip', '{"Steven Tyler", "David Coverdale", "Josh Lakkur"}', '2017', 'Dezvoltarea aplicatiilor medicale', 'Leac pentru veselie', '{"article_url": "https://www.google.com/?med", "full_description": "def", "demo_description": "d", "GIT_url": "www.git.hub", "avg_rating_value": 2.78, "rating_commits": 500}');

insert into datasets(domain, subdomain, country, data_format, author, year, dataset_title, article_title, info) 
values('IT', '{"MACHINE LEARNING", "ARTIFICIAL INTELLIGENCE"}', 'Patagonia', 'rar', '{"Joe Satriani", "Alice Cooper", "Joe Eliot", "Gary Moore"}', '2016', 'Dezvoltarea aplicatiilor inteligente', 'Fuljere groaza si Dumitru', '{"article_url": "https://www.google.com/?med", "full_description": "fhjisdghcfnjkhsdgvnkjdrh", "demo_description": "pai da", "GIT_url": "www.git.hub", "avg_rating_value": 3.98, "rating_commits": 1000}');


update datasets set info='{"article_url": "https://www.google.com/?wow", "full_description": "abcd", "demo_description": "a", "GIT_url": "www.git.hub", "avg_rating_value": 4.58, "rating_commits": 700}'
WHERE domain='IT';

update datasets set info='{"article_url": "https://www.google.com/?med", "full_description": "def", "demo_description": "d", "GIT_url": "www.git.hub", "avg_rating_value": 2.78, "rating_commits": 500}'
WHERE domain='MEDICINE';